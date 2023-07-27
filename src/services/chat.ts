import {
  ChannelTypeEnum,
  ChatLogID,
  ChatLog_Firestore,
  ChatRoomID,
  ChatRoomParticipantStatus,
  ChatRoomQuickCheckHashGen,
  ChatRoom_Firestore,
  FirestoreCollection,
  FriendshipStatus,
  MirrorPublicUser_Firestore,
  PREMIUM_CHAT_PRICE_COOKIES_MONTHLY,
  PostTransactionXCloudRequestBody,
  SendBirdAccessToken,
  SendBirdChannelType,
  SendBirdChannelURL,
  SendBirdPushNotifConfig,
  SendBirdUserID,
  TransactionType,
  TxRefID,
  UserID,
  User_Firestore,
  WishBuyFrequency,
  cookieToUSD,
  milkshakeLogoCookie,
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
  leaveGroupChannel,
  updateGroupChannel,
} from "./sendbird";
import {
  AddFriendToChatInput,
  AdminChatSettingsInput,
  ChatRoom,
  EnterChatRoomInput,
  LeaveChatInput,
  PromoteAdminInput,
  ResignAdminInput,
  SendFreeChatInput,
  UpdateChatSettingsInput,
} from "@/graphql/types/resolvers-types";
import { firestore } from "./firebase";
import { Query, QueryDocumentSnapshot } from "@google-cloud/firestore";
import { checkExistingFriendship } from "./friends";
import { _postTransaction, getWalletQLDB } from "./quantum";
import config from "@/config.env";
import { createPurchaseManifest } from "./stripe";
import { sendNotificationToUser } from "./notification";

export const extendChatPrivileges = async ({
  userID,
  extendUntil,
}: {
  userID: UserID;
  extendUntil?: Date;
}) => {
  console.log(`--- extendChatPrivileges ---`);

  let extendUntilDate = new Date(); // Get the current date
  extendUntilDate.setDate(extendUntilDate.getDate() + 30); // Add 30 days

  extendUntilDate = extendUntil ? extendUntil : extendUntilDate;

  console.log(`extendUntilDate = ${extendUntilDate}`);

  const isPaidChatUntil = createFirestoreTimestamp(extendUntilDate);
  console.log(`isPaidChatUntil = ${isPaidChatUntil}`);

  // check if theres a sendbird user
  try {
    const sendbirdUser = await getSendbirdUser({ userID });
    await Promise.all([
      updateFirestoreDoc<UserID, User_Firestore>({
        id: userID,
        payload: {
          isPaidChat: true,
          isPaidChatUntil,
        },
        collection: FirestoreCollection.USERS,
      }),
      updateFirestoreDoc<UserID, MirrorPublicUser_Firestore>({
        id: userID,
        payload: {
          hasPremiumChat: true,
        },
        collection: FirestoreCollection.MIRROR_USER,
      }),
    ]);
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
      profileUrl: user.avatar,
    });
    if (newSendbirdUser) {
      // update the user

      try {
        await Promise.all([
          updateFirestoreDoc<UserID, User_Firestore>({
            id: userID,
            payload: {
              sendBirdUserID: userID as unknown as SendBirdUserID,
              isPaidChat: true,
              isPaidChatUntil: createFirestoreTimestamp(extendUntilDate),
              sendBirdAccessToken:
                newSendbirdUser.access_token as SendBirdAccessToken,
            },
            collection: FirestoreCollection.USERS,
          }),
          updateFirestoreDoc<UserID, MirrorPublicUser_Firestore>({
            id: userID,
            payload: {
              hasPremiumChat: true,
            },
            collection: FirestoreCollection.MIRROR_USER,
          }),
        ]);

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
    return newSendbirdUser;
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
    const allAcceptedFriend = friendships
      .filter((frs) => frs.length > 0)
      .every((f) => f && f[0] && f[0].status === FriendshipStatus.ACCEPTED);

    if (!allAcceptedFriend) {
      throw new Error(`You are not friends with all participants`);
    }
  }
  // proceed with logic
  let chatroom: ChatRoom_Firestore | undefined;
  if (chatRoomID) {
    console.log(`search by chatRoomID=${chatRoomID}`);
    // get the existing firestore chat room
    chatroom = await getFirestoreDoc<ChatRoomID, ChatRoom_Firestore>({
      id: chatRoomID as ChatRoomID,
      collection: FirestoreCollection.CHAT_ROOMS,
    });
    console.log(`found chatroom`, chatroom);
  }
  // or check based on participants
  else if (!chatRoomID && participants && participants.length > 0) {
    // else match chat room based on participants (currently limited to 1-1 chat)
    const matchedRooms = await matchChatRoomByParticipants({
      participants,
    });
    if (matchedRooms.length > 0) {
      chatroom = matchedRooms[0];
    }
  }
  // handle the case where exists matching chat room
  if (chatroom) {
    console.log(`yes we got this far`);
    // edge case, if somehow the user is not a participant of the chat room throw an error
    if (
      !chatroom.participants[userID] ||
      chatroom.participants[userID] === ChatRoomParticipantStatus.EXPIRED
    ) {
      throw Error(
        `You are not a participant of this chat room. ChatRoomID=${chatRoomID}, UserID=${userID}}`
      );
    }
    console.log(`even better so far`);
    // check if the users have chat privileges & sync firestore
    const users = await Promise.all(
      Object.keys(chatroom.participants).map((uid) => {
        return getFirestoreDoc<UserID, User_Firestore>({
          id: uid as UserID,
          collection: FirestoreCollection.USERS,
        });
      })
    );
    console.log(`flag 1`);
    const selfUser = users.find((u) => u.id === userID);
    if (!selfUser) {
      throw new Error(`Could not find self user ${userID} in Firestore`);
    }
    console.log(`flag 2`);

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
    console.log(`flag 3`);
    let newSendBirdChannelURL: SendBirdChannelURL | undefined;
    let shouldUpdate = false;
    // check if the chatroom has a sendbird channel
    if (!chatroom.sendBirdChannelURL) {
      console.log(`flag 4a`);
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
      console.log(`flag 4b`);
      // if there already is a sendbird channel then we just have to make sure we are a part of it
      if (
        chatroom.participants[userID] !==
          ChatRoomParticipantStatus.SENDBIRD_ALLOWED &&
        syncedPermissions[userID] ===
          ChatRoomParticipantStatus.SENDBIRD_ALLOWED &&
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
    console.log(`flag 5a`);
    if (
      shouldUpdate ||
      !checkIfChatRoomPermissionsMatch({
        before: chatroom.participants,
        after: syncedPermissions,
      })
    ) {
      console.log(`flag 5b`);
      const updateData: Partial<ChatRoom_Firestore> = {
        participants: syncedPermissions,
      };
      if (newSendBirdChannelURL) {
        console.log(`flag 5c`);
        updateData.sendBirdChannelURL = newSendBirdChannelURL;
        updateData.sendBirdChannelType = SendBirdChannelType.GROUP;
      }
      console.log(`flag 5d`);
      const updatedChatRoom = await updateFirestoreDoc<
        ChatRoomID,
        ChatRoom_Firestore
      >({
        id: chatroom.id as ChatRoomID,
        payload: updateData,
        collection: FirestoreCollection.CHAT_ROOMS,
      });
      console.log(`flag 5e`);
      return {
        chatRoom: updatedChatRoom,
        isNew: false,
      };
    } else {
      console.log(`flag 5f`);
      return {
        chatRoom: chatroom,
        isNew: false,
      };
    }
  } else {
    console.log(`flag 5g`);
    // handle non-existent room, by creating a room
    if (!participants || (participants && participants.length < 2)) {
      // edge case, in case there are no participants
      throw new Error(`Could not create chat room without participants`);
    }

    console.log(`flag5h`);
    // get all participants info
    const users = await Promise.all(
      participants?.map((p) => {
        return getFirestoreDoc<UserID, User_Firestore>({
          id: p as UserID,
          collection: FirestoreCollection.USERS,
        });
      })
    );
    console.log(`flag 5i`);
    const hasSendbirdPrivileges = users.filter((u) =>
      checkIfUserHasPaidChatPrivileges(u)
    );
    console.log(`flag 5j`);
    const sendBirdParticipants = hasSendbirdPrivileges.map((u) => u.id);
    let sendBirdChannelURL: SendBirdChannelURL | undefined;
    let sendBirdChannelType: SendBirdChannelType | undefined;
    if (hasSendbirdPrivileges && hasSendbirdPrivileges.length > 1) {
      console.log(`flag 5k`);
      // we can create a sendbird channel since theres at least 2 valid participants
      const ch = await createGroupChannel({
        participants: sendBirdParticipants,
      });
      console.log(`flag 5l`);
      if (ch) {
        sendBirdChannelURL = ch.channel_url;
        sendBirdChannelType = SendBirdChannelType.GROUP;
      }
      console.log(`flag 5m`);
    }

    console.log(`flag 5n`);
    // create the firestore chat room
    const chatRoomID = uuidv4() as ChatRoomID;
    const chatroom = await createFirestoreDoc<ChatRoomID, ChatRoom_Firestore>({
      id: chatRoomID,
      data: {
        id: chatRoomID,
        title:
          users.length > 2 ? `${users.map((u) => u.username).join(", ")}` : "",
        note: ``,
        thumbnail: ``,
        participants: mapParticipantsPermissions({
          allUsers: users.map((u) => u.id),
          sendbirdAllowed: hasSendbirdPrivileges.map((u) => u.id),
        }),
        members: users.map((u) => u.id),
        admins: users.length > 2 ? [userID] : users.map((u) => u.id),
        type: users.length > 2 ? ChannelTypeEnum.GROUP : ChannelTypeEnum.DIRECT,
        firestoreQuickCheckHash: ChatRoomQuickCheckHashGen(
          users.map((u) => u.id)
        ),
        sendBirdChannelURL,
        sendBirdChannelType,
        sendBirdPushNotifConfig:
          hasSendbirdPrivileges.reduce<SendBirdPushNotifConfig>((acc, curr) => {
            return {
              ...acc,
              [curr.id]: {
                snoozeUntil: createFirestoreTimestamp(new Date(0)),
                allowPush: true,
              },
            };
          }, {}),
      },
      collection: FirestoreCollection.CHAT_ROOMS,
    });
    console.log(`flag 5o`);
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
  const ref = firestore.collection(FirestoreCollection.CHAT_ROOMS).where(
    // WARNING! firestoreQuickCheckHash is only used for 1-on-1 chats
    // it breaks when you are able to invite more people to a chatroom
    `firestoreQuickCheckHash`,
    "==",
    ChatRoomQuickCheckHashGen(participants)
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
  const rawChatRooms = await listFirestoreDocs<ChatRoom_Firestore>({
    where: {
      field: `members`,
      operator: "array-contains",
      value: userID,
    },
    collection: FirestoreCollection.CHAT_ROOMS,
  });

  const chatRooms = rawChatRooms.map((chatRoom) => {
    const pushConfig =
      chatRoom.sendBirdPushNotifConfig &&
      chatRoom.sendBirdPushNotifConfig[userID as UserID]
        ? {
            snoozeUntil: (
              chatRoom.sendBirdPushNotifConfig[userID as UserID]
                .snoozeUntil as any
            ).toDate(),
            allowPush:
              chatRoom.sendBirdPushNotifConfig[userID as UserID].allowPush,
          }
        : undefined;
    return {
      chatRoomID: chatRoom.id,
      participants: Object.keys(chatRoom.participants),
      admins: chatRoom.admins,
      sendBirdChannelURL: chatRoom.sendBirdChannelURL,
      pushConfig,
      thumbnail: chatRoom.thumbnail || "",
      title: chatRoom.title || "",
    };
  });
  return chatRooms;
};

export const updateChatSettingsFirestore = async ({
  userID,
  input,
}: {
  userID: UserID;
  input: UpdateChatSettingsInput;
}): Promise<ChatRoom> => {
  const { chatRoomID, allowPush, snoozeUntil } = input;

  // get the chat room
  const chatRoom = await getFirestoreDoc<ChatRoomID, ChatRoom_Firestore>({
    id: chatRoomID as ChatRoomID,
    collection: FirestoreCollection.CHAT_ROOMS,
  });

  const snoozeUntilDate = snoozeUntil
    ? createFirestoreTimestamp(new Date(parseInt(snoozeUntil)))
    : createFirestoreTimestamp(new Date(0));

  const updatedChatRoom = await updateFirestoreDoc<
    ChatRoomID,
    ChatRoom_Firestore
  >({
    id: chatRoomID as ChatRoomID,
    payload: {
      ...chatRoom,
      sendBirdPushNotifConfig: {
        ...chatRoom.sendBirdPushNotifConfig,
        [userID]: {
          allowPush,
          snoozeUntil: snoozeUntilDate,
        },
      },
    },
    collection: FirestoreCollection.CHAT_ROOMS,
  });

  const pushConfig =
    updatedChatRoom.sendBirdPushNotifConfig &&
    updatedChatRoom.sendBirdPushNotifConfig[userID as UserID]
      ? {
          snoozeUntil: (
            updatedChatRoom.sendBirdPushNotifConfig[userID as UserID]
              .snoozeUntil as any
          ).toDate(),
          allowPush:
            updatedChatRoom.sendBirdPushNotifConfig[userID as UserID].allowPush,
        }
      : undefined;
  return {
    chatRoomID: updatedChatRoom.id,
    participants: Object.keys(updatedChatRoom.participants),
    admins: chatRoom.admins,
    sendBirdChannelURL: updatedChatRoom.sendBirdChannelURL,
    pushConfig,
    thumbnail: updatedChatRoom.thumbnail || "",
    title: updatedChatRoom.title || "",
  };
};

export const sendFreeChatMessage = async (
  args: SendFreeChatInput,
  userID: UserID
) => {
  const { chatRoomID, message } = args;
  if (message.length > 150) {
    throw new Error(`Message cannot be longer than 150 characters`);
  }
  const [user, chatRoom] = await Promise.all([
    getFirestoreDoc<UserID, User_Firestore>({
      id: userID,
      collection: FirestoreCollection.USERS,
    }),
    getFirestoreDoc<ChatRoomID, ChatRoom_Firestore>({
      id: chatRoomID as ChatRoomID,
      collection: FirestoreCollection.CHAT_ROOMS,
    }),
  ]);
  if (!chatRoom.members.includes(userID)) {
    throw new Error(`You are not a participant of this chat room`);
  }
  const chatLogID = uuidv4() as ChatLogID;
  const payload: ChatLog_Firestore = {
    id: chatLogID,
    message,
    userID: user.id,
    avatar: user.avatar,
    username: user.username,
    chatRoomID: chatRoom.id,
    readers: chatRoom.members,
    createdAt: createFirestoreTimestamp(),
  };
  await createFirestoreDoc<ChatLogID, ChatLog_Firestore>({
    id: chatLogID,
    data: payload,
    collection: FirestoreCollection.CHAT_LOGS,
  });
  return "success";
};

export const upgradeUsersToPremiumChat = async (
  targets: {
    months: number;
    targetUserID: UserID;
  }[],
  payerUserID: UserID,
  chatRoomID?: ChatRoomID
) => {
  const payerUser = await getFirestoreDoc<UserID, User_Firestore>({
    id: payerUserID,
    collection: FirestoreCollection.USERS,
  });
  const payerTradingWallet = await getWalletQLDB({
    walletAliasID: payerUser.tradingWallet,
  });
  const referenceIDs: TxRefID[] = [];
  Promise.all(
    targets
      .filter((t) => t.months)
      .map(async (t) => {
        const { months, targetUserID } = t;
        const referenceID = uuidv4() as TxRefID;
        referenceIDs.push(referenceID);
        const [targetUser] = await Promise.all([
          getFirestoreDoc<UserID, User_Firestore>({
            id: targetUserID,
            collection: FirestoreCollection.USERS,
          }),
        ]);
        if (!payerUser || !targetUser) {
          throw new Error(`Could not find payer or target user`);
        }
        const pricePerMonthCookies = PREMIUM_CHAT_PRICE_COOKIES_MONTHLY;
        const totalPriceCookies = months * pricePerMonthCookies;
        if (payerTradingWallet.balance < totalPriceCookies) {
          throw new Error(`You do not have enough cookies to pay for this`);
        }
        const { purchaseManifest } = await createPurchaseManifest({
          title: `Buy ${months} months of premium chat for @${targetUser.username}`,
          note: `Buy ${months} months of premium chat for @${targetUser.username} paid for by @${payerUser.username} for ${totalPriceCookies} cookies`,
          wishID: config.LEDGER.premiumChatStore.premiumChatWishID,
          buyerUserID: payerUser.id,
          sellerUserID: config.LEDGER.premiumChatStore.userID,
          buyerWallet: payerUser.tradingWallet,
          escrowWallet: config.LEDGER.premiumChatStore.walletAliasID,
          agreedCookiePrice: totalPriceCookies,
          originalCookiePrice: totalPriceCookies,
          agreedBuyFrequency: WishBuyFrequency.ONE_TIME,
          originalBuyFrequency: WishBuyFrequency.ONE_TIME,
          referenceID,
          thumbnail: milkshakeLogoCookie,
          transactionType: TransactionType.PREMIUM_CHAT,
        });
        const transaction: PostTransactionXCloudRequestBody = {
          title: `@${targetUser.username} received ${months} months of premium chat`,
          note: `@${targetUser.username} received ${months} months of premium chat paid for by @${payerUser.username} for ${totalPriceCookies} cookies`,
          purchaseManifestID: purchaseManifest.id,
          attribution: "",
          thumbnail: milkshakeLogoCookie,
          type: TransactionType.PREMIUM_CHAT,
          amount: totalPriceCookies,
          senderWallet: payerUser.tradingWallet,
          senderUserID: payerUser.id,
          receiverWallet: config.LEDGER.premiumChatStore.walletAliasID,
          receiverUserID: config.LEDGER.premiumChatStore.userID,
          explanations: [
            {
              walletAliasID: config.LEDGER.premiumChatStore.walletAliasID,
              explanation: `Sold ${months} months of Premium Chat gifted to @${targetUser.username} from @${payerUser.username}`,
              amount: totalPriceCookies,
            },
            {
              walletAliasID: payerUser.tradingWallet,
              explanation: `Gifted ${months} months of Premium Chat to @${targetUser.username} from @${payerUser.username}`,
              amount: -totalPriceCookies,
            },
          ],
          gotRecalled: false,
          referenceID,
          sendPushNotif: true,
        };
        const tx = await _postTransaction(transaction);
        let nextPaidToDate: Date;

        if (targetUser.isPaidChatUntil) {
          const currentPaidUntilDate = new Date(
            (targetUser.isPaidChatUntil as any).seconds * 1000
          );

          if (currentPaidUntilDate < new Date()) {
            nextPaidToDate = new Date(
              Date.now() + months * 30 * 24 * 60 * 60 * 1000
            );
          } else {
            nextPaidToDate = new Date(
              (targetUser.isPaidChatUntil as any).seconds * 1000 +
                months * 30 * 24 * 60 * 60 * 1000
            );
          }
        } else {
          nextPaidToDate = new Date(
            Date.now() + months * 30 * 24 * 60 * 60 * 1000
          );
        }
        await extendChatPrivileges({
          userID: targetUser.id,
          extendUntil: nextPaidToDate,
        });
        return referenceID;
      })
  );

  if (chatRoomID) {
    const chatRoom = await getFirestoreDoc<ChatRoomID, ChatRoom_Firestore>({
      id: chatRoomID,
      collection: FirestoreCollection.CHAT_ROOMS,
    });
    const chatLogID = uuidv4() as ChatLogID;
    await createFirestoreDoc({
      id: chatRoomID,
      data: {
        id: chatLogID,
        message: `@${payerUser.username} bought Premium Chat for friends here!`,
        userID: config.LEDGER.premiumChatStore.userID,
        avatar: milkshakeLogoCookie,
        username: "Milkshake Store",
        chatRoomID,
        readers: chatRoom.members,
        createdAt: createFirestoreTimestamp(),
      },
      collection: FirestoreCollection.CHAT_LOGS,
    });
  }
  const notifRoute = chatRoomID
    ? `/app/chats/chat?chat=${chatRoomID}`
    : `/user?userID=${payerUser.id}`;
  await Promise.all(
    targets.map(async (t) => {
      await sendNotificationToUser({
        recipientUserID: t.targetUserID as UserID,
        notification: {
          data: {
            title: `@${payerUser.username} gifted you ${t.months} months of Premium Chat!`,
            body: "Go say thanks!",
            route: notifRoute,
            image: payerUser.avatar,
          },
        },
        shouldPush: false,
        metadataNote: "From a Premium Chat purchase",
      });
    })
  );
  return referenceIDs;
};

export const adminChatSettingsFirestore = async (
  args: AdminChatSettingsInput,
  userID: UserID
) => {
  const chatRoom = await getFirestoreDoc<ChatRoomID, ChatRoom_Firestore>({
    id: args.chatRoomID as ChatRoomID,
    collection: FirestoreCollection.CHAT_ROOMS,
  });
  if (!chatRoom) {
    throw new Error(`Could not find chat room ${args.chatRoomID}`);
  }
  if (!chatRoom.admins.includes(userID)) {
    throw new Error(
      `You do not have admin permission to change chat settings for this chat room`
    );
  }
  const payload: Partial<ChatRoom_Firestore> = {};
  if (args.title) {
    payload.title = args.title;
  }
  if (args.thumbnail) {
    payload.thumbnail = args.thumbnail;
  }
  const updatedChatRoom = await updateFirestoreDoc<
    ChatRoomID,
    ChatRoom_Firestore
  >({
    id: args.chatRoomID as ChatRoomID,
    payload,
    collection: FirestoreCollection.CHAT_ROOMS,
  });
  if (chatRoom.sendBirdChannelURL) {
    await updateGroupChannel({
      name: updatedChatRoom.title,
      avatar: updatedChatRoom.thumbnail,
      channelURL: chatRoom.sendBirdChannelURL as SendBirdChannelURL,
    });
  }
  return updatedChatRoom;
};

export const addFriendToChatFirestore = async (
  args: AddFriendToChatInput,
  userID: UserID
) => {
  const [chatRoom, friendUser] = await Promise.all([
    getFirestoreDoc<ChatRoomID, ChatRoom_Firestore>({
      id: args.chatRoomID as ChatRoomID,
      collection: FirestoreCollection.CHAT_ROOMS,
    }),
    getFirestoreDoc<UserID, User_Firestore>({
      id: userID,
      collection: FirestoreCollection.USERS,
    }),
  ]);
  if (!chatRoom) {
    throw new Error(`Could not find chat room ${args.chatRoomID}`);
  }
  if (!chatRoom.admins.includes(userID)) {
    throw new Error(
      `You do not have admin permission to change chat settings for this chat room`
    );
  }
  await updateFirestoreDoc<ChatRoomID, ChatRoom_Firestore>({
    id: args.chatRoomID as ChatRoomID,
    payload: {
      members: [
        ...chatRoom.members.filter((m) => m !== args.friendID),
        args.friendID,
      ],
      participants: {
        ...chatRoom.participants,
        [args.friendID]: friendUser.sendBirdUserID
          ? ChatRoomParticipantStatus.SENDBIRD_ALLOWED
          : ChatRoomParticipantStatus.FREE_TIER,
      },
    },
    collection: FirestoreCollection.CHAT_ROOMS,
  });
  if (checkIfUserHasPaidChatPrivileges(friendUser)) {
    if (!chatRoom.members.includes(args.friendID)) {
      await inviteToGroupChannelWithAutoAccept({
        userIDs: [args.friendID],
        channelUrl: chatRoom.sendBirdChannelURL as SendBirdChannelURL,
      });
    }
  }
  return "status";
};

export const leaveChatFirestore = async (
  args: LeaveChatInput,
  userID: UserID
) => {
  const [chatRoom, selfUser, targetUser] = await Promise.all([
    getFirestoreDoc<ChatRoomID, ChatRoom_Firestore>({
      id: args.chatRoomID as ChatRoomID,
      collection: FirestoreCollection.CHAT_ROOMS,
    }),
    getFirestoreDoc<UserID, User_Firestore>({
      id: userID,
      collection: FirestoreCollection.USERS,
    }),
    getFirestoreDoc<UserID, User_Firestore>({
      id: args.targetUserID,
      collection: FirestoreCollection.USERS,
    }),
  ]);
  if (!chatRoom) {
    throw new Error(`Could not find chat room ${args.chatRoomID}`);
  }
  if (!chatRoom.members.includes(args.targetUserID)) {
    throw new Error(`They are not a member of this chat room`);
  }
  if (
    userID === args.targetUserID &&
    chatRoom.admins.includes(args.targetUserID)
  ) {
    throw new Error(
      `You cannot leave a chat room you are an admin of. Resign as admin first!`
    );
  }
  if (args.targetUserID !== userID && !chatRoom.admins.includes(userID)) {
    throw new Error("Only admins can kick out other users");
  }
  if (
    chatRoom.admins.includes(args.targetUserID) &&
    args.targetUserID !== userID
  ) {
    throw new Error(
      "You cannot kick out an admin. They must leave themselves."
    );
  }
  await updateFirestoreDoc<ChatRoomID, ChatRoom_Firestore>({
    id: args.chatRoomID as ChatRoomID,
    payload: {
      members: chatRoom.members.filter((m) => m !== args.targetUserID),
      participants: {
        ...chatRoom.participants,
        [args.targetUserID]: ChatRoomParticipantStatus.EXPIRED,
      },
    },
    collection: FirestoreCollection.CHAT_ROOMS,
  });
  if (checkIfUserHasPaidChatPrivileges(targetUser)) {
    if (chatRoom.sendBirdChannelURL) {
      await leaveGroupChannel({
        channelUrl: chatRoom.sendBirdChannelURL as SendBirdChannelURL,
        userIDs: [args.targetUserID],
        reason:
          args.targetUserID === userID ? "left_by_own_choice" : "admin_removed",
      });
    }
  }
  return "status";
};

export const resignAdminFirestore = async (
  args: ResignAdminInput,
  userID: UserID
) => {
  const [chatRoom, selfUser] = await Promise.all([
    getFirestoreDoc<ChatRoomID, ChatRoom_Firestore>({
      id: args.chatRoomID as ChatRoomID,
      collection: FirestoreCollection.CHAT_ROOMS,
    }),
    getFirestoreDoc<UserID, User_Firestore>({
      id: userID,
      collection: FirestoreCollection.USERS,
    }),
  ]);
  if (!chatRoom) {
    throw new Error(`Could not find chat room ${args.chatRoomID}`);
  }
  if (!chatRoom.admins.includes(userID)) {
    throw new Error(
      `You do not have admin permission to change chat settings for this chat room`
    );
  }
  if (!chatRoom.members.includes(userID)) {
    throw new Error(`You user ${userID} arent a member of this chat room`);
  }
  await updateFirestoreDoc<ChatRoomID, ChatRoom_Firestore>({
    id: args.chatRoomID as ChatRoomID,
    payload: {
      admins: chatRoom.admins.filter((a) => a !== userID),
    },
    collection: FirestoreCollection.CHAT_ROOMS,
  });
  return "status";
};

export const promoteAdminFirestore = async (
  args: PromoteAdminInput,
  userID: UserID
) => {
  const [chatRoom, memberUser] = await Promise.all([
    getFirestoreDoc<ChatRoomID, ChatRoom_Firestore>({
      id: args.chatRoomID as ChatRoomID,
      collection: FirestoreCollection.CHAT_ROOMS,
    }),
    getFirestoreDoc<UserID, User_Firestore>({
      id: args.memberID,
      collection: FirestoreCollection.USERS,
    }),
  ]);
  if (!chatRoom) {
    throw new Error(`Could not find chat room ${args.chatRoomID}`);
  }
  if (!chatRoom.admins.includes(userID)) {
    throw new Error(
      `You do not have admin permission to change chat settings for this chat room`
    );
  }
  if (!chatRoom.members.includes(args.memberID)) {
    throw new Error(`User ${args.memberID} isnt a member of this chat room`);
  }
  if (chatRoom.admins.includes(args.memberID)) {
    throw new Error(
      `User ${args.memberID} is already an admin of this chat room`
    );
  }
  await updateFirestoreDoc<ChatRoomID, ChatRoom_Firestore>({
    id: args.chatRoomID as ChatRoomID,
    payload: {
      admins: [
        ...chatRoom.admins.filter((a) => a !== args.memberID),
        args.memberID,
      ],
    },
    collection: FirestoreCollection.CHAT_ROOMS,
  });
  return "status";
};
