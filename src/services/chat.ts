import {
  ChatRoomID,
  ChatRoom_Firestore,
  FirestoreCollection,
  FriendshipStatus,
  SendBirdChannelType,
  SendBirdChannelURL,
  SendBirdUserID,
  UserID,
  User_Firestore,
} from "@milkshakechat/helpers";
import { v4 as uuidv4 } from "uuid";
import {
  createFirestoreDoc,
  createFirestoreTimestamp,
  getFirestoreDoc,
  isLaterThanNow_FirestoreTimestamp,
  listFirestoreDocs,
  updateFirestoreDoc,
} from "@/services/firestore";
import {
  PartialSendbirdUser,
  checkIfUserHasPaidChatPrivileges,
  createGroupChannel,
  createSendbirdUser,
  getSendbirdUser,
  inviteToGroupChannelWithAutoAccept,
} from "./sendbird";
import { EnterChatRoomInput } from "@/graphql/types/resolvers-types";
import { firestore } from "./firebase";
import { Query, QueryDocumentSnapshot } from "@google-cloud/firestore";
import { checkExistingFriendship } from "./friends";

export const extendChatPrivileges = async ({ userID }: { userID: UserID }) => {
  console.log(`--- extendChatPrivileges ---`);

  let sendbirdUser: PartialSendbirdUser | undefined;
  // check if theres a sendbird user
  try {
    sendbirdUser = await getSendbirdUser({ userID });
  } catch (e) {
    // create a user if not
    sendbirdUser = await createSendbirdUser({ userID });
  }

  // update the user
  let extendUntilDate = new Date(); // Get the current date
  extendUntilDate.setDate(extendUntilDate.getDate() + 30); // Add 30 days
  try {
    await updateFirestoreDoc<UserID, User_Firestore>({
      id: userID,
      payload: {
        sendBirdUserID: userID as unknown as SendBirdUserID,
        isPaidChat: true,
        isPaidChatUntil: createFirestoreTimestamp(extendUntilDate),
      },
      collection: FirestoreCollection.USERS,
    });
    console.log(
      `
      --------------------------------------
      
      Successfully extended chat privileges for ${userID} until ${extendUntilDate.toString()}
      
      --------------------------------------`
    );
  } catch (e) {
    console.log(e);
    console.log(`Could not update user ${userID} in Firestore.`);
  }
};

export const enterChatRoom = async ({
  chatRoomID,
  userID,
  participants,
}: {
  userID: UserID;
  chatRoomID?: ChatRoomID;
  participants?: UserID[];
}): Promise<ChatRoom_Firestore> => {
  // get our own info
  const user = await getFirestoreDoc<UserID, User_Firestore>({
    id: userID as UserID,
    collection: FirestoreCollection.USERS,
  });
  // proceed with logic
  let chatroom: ChatRoom_Firestore | undefined;
  if (chatRoomID) {
    // get the existing firestore chat room
    chatroom = await getFirestoreDoc<ChatRoomID, ChatRoom_Firestore>({
      id: chatRoomID as ChatRoomID,
      collection: FirestoreCollection.CHAT_ROOMS,
    });
  }
  // or check based on participants
  else if (!chatRoomID && participants && participants[0] && participants[1]) {
    // else match chat room based on participants (currently limited to 1-1 chat)
    const matchedRooms = await matchChatRoomByParticipants({
      primaryMatchUserID: participants[0],
      secondaryMatchUserID: participants[1],
      otherUserIDs: participants,
    });
    if (matchedRooms.length > 1) {
      chatroom = matchedRooms[0];
    }
  }
  // handle the case where exists matching chat room
  if (chatroom) {
    // edge case, if somehow the user is not a participant of the chat room throw an error
    if (!chatroom.participants.includes(userID)) {
      throw Error(
        `You are not a participant of this chat room. ChatRoomID=${chatRoomID}, UserID=${userID}}`
      );
    }
    // check if the user has chat privileges
    if (checkIfUserHasPaidChatPrivileges(user)) {
      // if has privileges, then check that firestore also acknolwedges that. return chatroom
      if (chatroom.sendBirdParticipants.includes(userID)) {
        return chatroom;
      } else {
        // add user to sendbird channel
        await inviteToGroupChannelWithAutoAccept({
          userIDs: [userID],
          channelUrl: chatroom.sendBirdChannelURL as SendBirdChannelURL,
        });
        // update chatroom with sendbird user
        const updatedChatRoom = await updateFirestoreDoc<
          ChatRoomID,
          ChatRoom_Firestore
        >({
          id: chatRoomID as ChatRoomID,
          payload: {
            sendBirdParticipants: [...chatroom.sendBirdParticipants, userID],
          },
          collection: FirestoreCollection.CHAT_ROOMS,
        });
        return updatedChatRoom;
      }
    } else {
      // if no privileges, then check that firestore also acknolwedges that. return chatroom
      if (!chatroom.sendBirdParticipants.includes(userID)) {
        return chatroom;
      } else {
        // update chatroom
        const updatedChatRoom = await updateFirestoreDoc<
          ChatRoomID,
          ChatRoom_Firestore
        >({
          id: chatRoomID as ChatRoomID,
          payload: {
            sendBirdParticipants: chatroom.sendBirdParticipants.filter(
              (p) => p !== userID
            ),
          },
          collection: FirestoreCollection.CHAT_ROOMS,
        });
        return updatedChatRoom;
      }
    }
  } else {
    // handle non-existent room, by creating a room
    if (!participants) {
      // edge case, in case there are no participants
      throw new Error(`Could not create chat room without participants`);
    }
    // reject if you are not friends
    const friendships = await Promise.all(
      participants.map((p) => {
        return checkExistingFriendship({
          to: p,
          from: userID,
        });
      })
    );
    const allAcceptedFriend = friendships.every(
      (f) => f && f[0] && f[0].status === FriendshipStatus.ACCEPTED
    );
    if (!allAcceptedFriend) {
      throw new Error(`You are not friends with all participants`);
    }

    // get all participants info in terms of paid chat priviledges
    const users = await Promise.all(
      participants?.map((p) => {
        return getFirestoreDoc<UserID, User_Firestore>({
          id: p as UserID,
          collection: FirestoreCollection.USERS,
        });
      })
    );
    const hasSendbirdPrivileges = users.filter((u) =>
      checkIfUserHasPaidChatPrivileges(u)
    );
    const sendBirdParticipants = hasSendbirdPrivileges.map((u) => u.id);
    let sendBirdChannelURL: SendBirdChannelURL | undefined;
    let sendBirdChannelType: SendBirdChannelType | undefined;
    if (hasSendbirdPrivileges && hasSendbirdPrivileges.length > 1) {
      // we can create a sendbird channel since theres at least 2 valid participants
      const ch = await createGroupChannel({
        participants: sendBirdParticipants,
      });
      if (ch) {
        sendBirdChannelURL = ch.channel_url;
        sendBirdChannelType = SendBirdChannelType.GROUP;
      }
    }
    // create the firestore chat room
    const chatRoomID = uuidv4() as ChatRoomID;
    const chatroom = await createFirestoreDoc<ChatRoomID, ChatRoom_Firestore>({
      id: chatRoomID,
      data: {
        id: chatRoomID,
        note: ``,
        participants: users.map((u) => u.id),
        sendBirdParticipants,
        sendBirdChannelURL,
        sendBirdChannelType,
      },
      collection: FirestoreCollection.CHAT_ROOMS,
    });
    return chatroom;
  }
};

// list double where
export const matchChatRoomByParticipants = async ({
  primaryMatchUserID,
  secondaryMatchUserID,
  otherUserIDs,
}: {
  primaryMatchUserID: UserID;
  secondaryMatchUserID: UserID;
  otherUserIDs: UserID[];
}): Promise<ChatRoom_Firestore[]> => {
  const ref = firestore
    .collection(FirestoreCollection.CHAT_ROOMS)
    .where("participants", "array-contains", primaryMatchUserID)
    .where(
      "participants",
      "array-contains",
      secondaryMatchUserID
    ) as Query<ChatRoom_Firestore>;

  const collectionItems = await ref.get();

  if (collectionItems.empty) {
    return [];
  } else {
    const rooms = collectionItems.docs.map(
      (doc: QueryDocumentSnapshot<ChatRoom_Firestore>) => {
        const data = doc.data();
        return data;
      }
    );
    if (otherUserIDs) {
      const filteredRooms = rooms.filter((room) =>
        room.participants.every((u) => otherUserIDs.includes(u))
      );
      return filteredRooms;
    }
    return rooms;
  }
};
