import {
  ChatRoomID,
  ChatRoomParticipantStatus,
  ChatRoom_Firestore,
  FirestoreCollection,
  FriendshipStatus,
  SendBirdAccessToken,
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
import { ChatRoom, EnterChatRoomInput } from "@/graphql/types/resolvers-types";
import { firestore } from "./firebase";
import { Query, QueryDocumentSnapshot } from "@google-cloud/firestore";
import { checkExistingFriendship } from "./friends";

export const extendChatPrivileges = async ({ userID }: { userID: UserID }) => {
  console.log(`--- extendChatPrivileges ---`);

  // check if theres a sendbird user
  try {
    const sendbirdUser = await getSendbirdUser({ userID });
    return sendbirdUser;
  } catch (e) {
    // create a user if not
    const user = await getFirestoreDoc<UserID, User_Firestore>({
      id: userID,
      collection: FirestoreCollection.USERS,
    });
    const newSendbirdUser = await createSendbirdUser({
      userID,
      displayName: user.displayName || user.username,
    });
    if (newSendbirdUser) {
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
            sendBirdAccessToken:
              newSendbirdUser.access_token as SendBirdAccessToken,
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
      return newSendbirdUser;
    }
  }
};

const mapParticipantsPermissions = ({
  allUsers,
  sendbirdAllowed,
}: {
  allUsers: UserID[];
  sendbirdAllowed: UserID[];
}): { [key: UserID]: ChatRoomParticipantStatus } => {
  let result: { [key: UserID]: ChatRoomParticipantStatus } = {};
  for (let i = 0; i < allUsers.length; i++) {
    if (sendbirdAllowed.includes(allUsers[i])) {
      result[allUsers[i]] = ChatRoomParticipantStatus.SENDBIRD_ALLOWED;
    } else {
      result[allUsers[i]] = ChatRoomParticipantStatus.FREE_TIER;
    }
  }
  return result;
};

export const enterChatRoom = async ({
  chatRoomID,
  userID,
  participants,
}: {
  userID: UserID;
  chatRoomID?: ChatRoomID;
  participants?: UserID[];
}): Promise<{ chatRoom: ChatRoom_Firestore; isNew: boolean }> => {
  // reject if you are not friends
  if (participants && participants.length > 0) {
    const friendships = await Promise.all(
      participants.map((p) => {
        return checkExistingFriendship({
          to: p,
          from: userID,
        });
      })
    );
    console.log(`friendships`, friendships);
    console.log(
      `countable = `,
      friendships.filter((frs) => frs.length === 0).length
    );
    const allAcceptedFriend = friendships
      .filter((frs) => frs.length > 0)
      .every((f) => f && f[0] && f[0].status === FriendshipStatus.ACCEPTED);
    console.log(`allAcceptedFriend`, allAcceptedFriend);
    if (!allAcceptedFriend) {
      throw new Error(`You are not friends with all participants`);
    }
  }
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
  else if (!chatRoomID && participants && participants.length > 0) {
    console.log(`Matchng participants based on usr ids..`);
    // else match chat room based on participants (currently limited to 1-1 chat)
    const matchedRooms = await matchChatRoomByParticipants({
      participants,
    });
    console.log(
      `matchedRooms`,
      matchedRooms.map((r) => r.id)
    );
    if (matchedRooms.length > 0) {
      chatroom = matchedRooms[0];
    }
  }
  // handle the case where exists matching chat room
  if (chatroom) {
    // edge case, if somehow the user is not a participant of the chat room throw an error
    if (
      !chatroom.participants[userID] ||
      chatroom.participants[userID] === ChatRoomParticipantStatus.EXPIRED
    ) {
      throw Error(
        `You are not a participant of this chat room. ChatRoomID=${chatRoomID}, UserID=${userID}}`
      );
    }
    // check if the users have chat privileges & sync firestore
    const users = await Promise.all(
      Object.keys(chatroom.participants).map((uid) => {
        return getFirestoreDoc<UserID, User_Firestore>({
          id: uid as UserID,
          collection: FirestoreCollection.USERS,
        });
      })
    );
    const selfUser = users.find((u) => u.id === userID);
    if (!selfUser) {
      throw new Error(`Could not find self user ${userID} in Firestore`);
    }
    const syncedPermissions = users.reduce<
      Record<UserID, ChatRoomParticipantStatus>
    >((acc, curr) => {
      return {
        ...acc,
        [curr.id]:
          chatroom?.participants[curr.id] === ChatRoomParticipantStatus.EXPIRED
            ? ChatRoomParticipantStatus.EXPIRED
            : checkIfUserHasPaidChatPrivileges(curr)
            ? ChatRoomParticipantStatus.SENDBIRD_ALLOWED
            : ChatRoomParticipantStatus.FREE_TIER,
      };
    }, {});
    let newSendBirdChannelURL: SendBirdChannelURL | undefined;
    let shouldUpdate = false;
    // check if the chatroom has a sendbird channel
    if (!chatroom.sendBirdChannelURL) {
      // if not, then we have to create one
      // but only if there are at least two users with chat privileges
      if (users.filter((u) => checkIfUserHasPaidChatPrivileges(u)).length > 1) {
        // create the sendbird channel...
        const ch = await createGroupChannel({
          participants: users
            .filter((u) => checkIfUserHasPaidChatPrivileges(u))
            .map((u) => u.id),
        });
        newSendBirdChannelURL = ch?.channel_url;
        shouldUpdate = true;
      }
    } else {
      // if there already is a sendbird channel then we just have to make sure we are a part of it
      if (
        chatroom.participants[userID] === ChatRoomParticipantStatus.FREE_TIER &&
        checkIfUserHasPaidChatPrivileges(selfUser)
      ) {
        await inviteToGroupChannelWithAutoAccept({
          userIDs: [userID],
          channelUrl: chatroom.sendBirdChannelURL as SendBirdChannelURL,
        });
        shouldUpdate = true;
      }
    }
    // update chatroom if there are any changes
    if (
      shouldUpdate ||
      !checkIfChatRoomPermissionsMatch({
        before: chatroom.participants,
        after: syncedPermissions,
      })
    ) {
      const updateData: Partial<ChatRoom_Firestore> = {
        participants: syncedPermissions,
      };
      if (newSendBirdChannelURL) {
        updateData.sendBirdChannelURL = newSendBirdChannelURL;
        updateData.sendBirdChannelType = SendBirdChannelType.GROUP;
      }
      const updatedChatRoom = await updateFirestoreDoc<
        ChatRoomID,
        ChatRoom_Firestore
      >({
        id: chatroom.id as ChatRoomID,
        payload: updateData,
        collection: FirestoreCollection.CHAT_ROOMS,
      });
      return {
        chatRoom: updatedChatRoom,
        isNew: false,
      };
    } else {
      console.log(`no need to update anything since no changes`);
      return {
        chatRoom: chatroom,
        isNew: false,
      };
    }
  } else {
    // handle non-existent room, by creating a room
    if (!participants || (participants && participants.length < 2)) {
      // edge case, in case there are no participants
      throw new Error(`Could not create chat room without participants`);
    }

    // get all participants info
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
        participants: mapParticipantsPermissions({
          allUsers: users.map((u) => u.id),
          sendbirdAllowed: hasSendbirdPrivileges.map((u) => u.id),
        }),
        firestoreParticipantSearch: users.map((u) => u.id),
        firestoreQuickCheckHash: users
          .map((u) => u.id)
          .sort()
          .join(","),
        sendBirdChannelURL,
        sendBirdChannelType,
      },
      collection: FirestoreCollection.CHAT_ROOMS,
    });
    return {
      chatRoom: chatroom,
      isNew: true,
    };
  }
};

// WARNING! firestoreQuickCheckHash is only used for 1-on-1 chats
// it breaks when you are able to invite more people to a chatroom
export const matchChatRoomByParticipants = async ({
  participants,
}: {
  participants: UserID[];
}): Promise<ChatRoom_Firestore[]> => {
  console.log(`firestoreQuickCheckHash`, participants.sort().join(","));
  const ref = firestore.collection(FirestoreCollection.CHAT_ROOMS).where(
    // WARNING! firestoreQuickCheckHash is only used for 1-on-1 chats
    // it breaks when you are able to invite more people to a chatroom
    `firestoreQuickCheckHash`,
    "==",
    participants.sort().join(",")
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
    return rooms;
  }
};

const checkIfChatRoomPermissionsMatch = ({
  before,
  after,
}: {
  before: Record<UserID, ChatRoomParticipantStatus>;
  after: Record<UserID, ChatRoomParticipantStatus>;
}) => {
  let perfectMatch = true;
  Object.keys(after).forEach((userID) => {
    if (before[userID as UserID] !== after[userID as UserID]) {
      perfectMatch = false;
    }
  });
  return perfectMatch;
};

export const retrieveChatRooms = async ({
  userID,
}: {
  userID: UserID;
}): Promise<ChatRoom[]> => {
  console.log(`retrieveChatRooms...`);

  console.log(`
  
  where: {
    field: "firestoreParticipantSearch",
    operator: "array-contains",
    value: ${userID},
  },
  
  
`);

  const rawChatRooms = await listFirestoreDocs<ChatRoom_Firestore>({
    where: {
      field: `firestoreParticipantSearch`,
      operator: "array-contains",
      value: userID,
    },
    collection: FirestoreCollection.CHAT_ROOMS,
  });

  console.log(`Got ${rawChatRooms.length} chat rooms`);

  const chatRooms = rawChatRooms.map((chatRoom) => ({
    chatRoomID: chatRoom.id,
    participants: Object.keys(chatRoom.participants),
    sendBirdParticipants: Object.keys(chatRoom.participants).filter(
      (userID) =>
        chatRoom.participants[userID as UserID] ===
        ChatRoomParticipantStatus.SENDBIRD_ALLOWED
    ),
    sendBirdChannelURL: chatRoom.sendBirdChannelURL,
  }));
  return chatRooms;
};
