import {
  FriendshipAction,
  SendFriendRequestInput,
  ViewPublicProfileResponseSuccess,
  FriendshipStatus as FriendshipStatusEnum,
  Story,
  PrivacyModeEnum,
  ModifyProfileInput,
} from "@/graphql/types/resolvers-types";
import {
  FirestoreCollection,
  FriendshipID,
  FriendshipStatus,
  Friendship_Firestore,
  Story_Firestore,
  UserID,
  Username,
  placeholderImageThumbnail,
  privacyModeEnum,
} from "@milkshakechat/helpers";
import {
  createFirestoreDoc,
  createFirestoreTimestamp,
  getFirestoreDoc,
  listFirestoreDocs,
  listFirestoreDocsDoubleWhere,
  updateFirestoreDoc,
} from "@/services/firestore";
import { v4 as uuidv4 } from "uuid";
import { User_Firestore } from "@milkshakechat/helpers";
import { firestore } from "@/services/firebase";
import { Query, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { convertStoryToGraphQL } from "@/services/story";
import * as admin from "firebase-admin";
import {
  notifyAcceptFriendRequest,
  notifySentFriendRequest,
} from "./notification";

export const checkUserPrivacy = async (
  userID: UserID
): Promise<privacyModeEnum> => {
  const user = await getFirestoreDoc<UserID, User_Firestore>({
    id: userID,
    collection: FirestoreCollection.USERS,
  });
  return user.privacyMode;
};

export const checkExistingFriendship = async ({
  to,
  from,
}: {
  to: UserID;
  from: UserID;
}) => {
  const ref = firestore
    .collection(FirestoreCollection.FRIENDSHIPS)
    .where("friendID", "==", to)
    .where("primaryUserID", "==", from) as Query<Friendship_Firestore>;
  const collectionItems = await ref.get();
  if (collectionItems.empty) {
    return [];
  } else {
    return collectionItems.docs.map(
      (doc: QueryDocumentSnapshot<Friendship_Firestore>) => {
        const data = doc.data();
        return data;
      }
    );
  }
};

interface NextFriendshipStatus {
  sitRep: {
    forward: FriendshipStatus;
    reverse: FriendshipStatus;
  };
  message: string;
  status: FriendshipStatus;
}
interface SendFriendRequestFirestoreProps {
  from: UserID;
  request: SendFriendRequestInput;
}
export const sendFriendRequestFirestore = async ({
  from,
  request,
}: SendFriendRequestFirestoreProps): Promise<NextFriendshipStatus> => {
  const { recipientID: to } = request;

  const [fromUser, toUser] = await Promise.all([
    getFirestoreDoc<UserID, User_Firestore>({
      id: from,
      collection: FirestoreCollection.USERS,
    }),
    getFirestoreDoc<UserID, User_Firestore>({
      id: to,
      collection: FirestoreCollection.USERS,
    }),
  ]);
  if (!fromUser || !toUser) {
    throw Error(`Could not find user`);
  }

  const [forwardRelation, reverseRelation] = await Promise.all([
    checkExistingFriendship({
      to,
      from,
    }),
    checkExistingFriendship({
      from: to,
      to: from,
    }),
  ]);
  const forward = forwardRelation[0];
  const reverse = reverseRelation[0];
  // if an existing relationship is found
  if (forward && reverse) {
    // if recipient blocked you --> reject
    if (reverse.status === FriendshipStatus.BLOCKED) {
      const comment = `You have been blocked by ${to}`;
      console.log(comment);
      return {
        sitRep: {
          forward: forward.status,
          reverse: reverse.status,
        },
        message: comment,
        status: FriendshipStatus.BLOCKED,
      };
    }
    // if you blocked recipient --> unblock & re-send request
    if (forward.status === FriendshipStatus.BLOCKED) {
      const [_forward, _reverse, pushRes] = await Promise.all([
        // unblock them & set status REQUESTED
        updateFirestoreDoc<FriendshipID, Friendship_Firestore>({
          id: forward.id,
          payload: {
            status: FriendshipStatus.SENT_REQUEST,
            initiatedBy: from,
            requestNonce: forward.requestNonce + 1,
            username: toUser.username,
            avatar: toUser.avatar,
          },
          collection: FirestoreCollection.FRIENDSHIPS,
        }),
        // re-send request & update nonce
        // assumes the recipient hasnt blocked you (this logic is handled in above if statement)
        updateFirestoreDoc<FriendshipID, Friendship_Firestore>({
          id: reverse.id,
          payload: {
            status: FriendshipStatus.GOT_REQUEST,
            initiatedBy: from,
            requestNonce: forward.requestNonce + 1,
            username: fromUser.username,
            avatar: fromUser.avatar,
          },
          collection: FirestoreCollection.FRIENDSHIPS,
        }),
        // send push notifs
        notifySentFriendRequest({
          recipientUserID: to,
          senderUserID: from,
        }),
      ]);
      // return sitrep
      const comment = `You previously blocked ${to} but have now unblocked them & resent a friend request`;
      console.log(comment);
      return {
        sitRep: {
          forward: _forward.status,
          reverse: _reverse.status,
        },
        message: comment,
        status: FriendshipStatus.SENT_REQUEST,
      };
    }
    // if has prior friendship but now NONE --> re-send request
    if (forward.status === FriendshipStatus.NONE) {
      const [_forward, _reverse, pushRes] = await Promise.all([
        // re-send request & update nonce
        updateFirestoreDoc<FriendshipID, Friendship_Firestore>({
          id: forward.id,
          payload: {
            status: FriendshipStatus.SENT_REQUEST,
            initiatedBy: from,
            requestNonce: forward.requestNonce + 1,
            username: toUser.username,
            avatar: toUser.avatar,
          },
          collection: FirestoreCollection.FRIENDSHIPS,
        }),

        // re-send request & update nonce
        // assumes the recipient hasnt blocked you (this logic is handled in above if statement)
        updateFirestoreDoc<FriendshipID, Friendship_Firestore>({
          id: reverse.id,
          payload: {
            status: FriendshipStatus.GOT_REQUEST,
            initiatedBy: from,
            requestNonce: forward.requestNonce + 1,
            username: fromUser.username,
            avatar: fromUser.avatar,
          },
          collection: FirestoreCollection.FRIENDSHIPS,
        }),
        // send push notif
        notifySentFriendRequest({
          recipientUserID: to,
          senderUserID: from,
        }),
      ]);
      // return sitrep
      const comment = `You previously had a friendship with ${to} but now do not. A friend request has been re-sent`;
      console.log(comment);

      return {
        sitRep: {
          forward: _forward.status,
          reverse: _reverse.status,
        },
        message: comment,
        status: FriendshipStatus.SENT_REQUEST,
      };
    }
    // if already friends
    if (
      forward.status === FriendshipStatus.ACCEPTED &&
      reverse.status === FriendshipStatus.ACCEPTED
    ) {
      const comment = `You are already friends with ${to}`;
      console.log(comment);
      return {
        sitRep: {
          forward: forward.status,
          reverse: reverse.status,
        },
        message: comment,
        status: FriendshipStatus.ACCEPTED,
      };
    }
    // if existing request from you -> update requestNonce
    if (
      reverse.status === FriendshipStatus.GOT_REQUEST ||
      reverse.status === FriendshipStatus.DECLINED ||
      reverse.status === FriendshipStatus.NONE
    ) {
      const comment =
        reverse.status === FriendshipStatus.DECLINED
          ? `They rejected your prior friend request but you have re-sent another friend request to ${to}`
          : `You already sent a friend request & are waiting to hear back from ${to}`;
      console.log(comment);
      const [_forward, _reverse, pushRes] = await Promise.all([
        // re-send request & update nonce
        updateFirestoreDoc<FriendshipID, Friendship_Firestore>({
          id: forward.id,
          payload: {
            status: FriendshipStatus.SENT_REQUEST,
            initiatedBy: from,
            requestNonce: forward.requestNonce + 1,
            username: toUser.username,
            avatar: toUser.avatar,
          },
          collection: FirestoreCollection.FRIENDSHIPS,
        }),

        // re-send request & update nonce
        // assumes reciepient hasnt blocked you
        updateFirestoreDoc<FriendshipID, Friendship_Firestore>({
          id: reverse.id,
          payload: {
            status: FriendshipStatus.GOT_REQUEST,
            initiatedBy: from,
            requestNonce: forward.requestNonce + 1,
            username: fromUser.username,
            avatar: fromUser.avatar,
          },
          collection: FirestoreCollection.FRIENDSHIPS,
        }),

        // send push notif
        notifySentFriendRequest({
          recipientUserID: to,
          senderUserID: from,
        }),
      ]);
      return {
        sitRep: {
          forward: _forward.status,
          reverse: _reverse.status,
        },
        message: comment,
        status: FriendshipStatus.SENT_REQUEST,
      };
    }
    // if existing request from recipient -> auto accept
    // because you are sending them a friend request when they already sent you one, it can be assumed as an acceptance
    // assume you havent blocked them (handled above)
    if (
      forward.status === FriendshipStatus.GOT_REQUEST ||
      reverse.status === FriendshipStatus.SENT_REQUEST
    ) {
      const comment = `You accepted an existing friend request from ${to}`;
      console.log(comment);
      const [_forward, _reverse, pushRes] = await Promise.all([
        // accept their friend request from your POV (forward)
        updateFirestoreDoc<FriendshipID, Friendship_Firestore>({
          id: forward.id,
          payload: {
            status: FriendshipStatus.ACCEPTED,
            username: toUser.username,
            avatar: toUser.avatar,
          },
          collection: FirestoreCollection.FRIENDSHIPS,
        }),

        // update the existing friend request from their POV (reverse)
        updateFirestoreDoc<FriendshipID, Friendship_Firestore>({
          id: reverse.id,
          payload: {
            status: FriendshipStatus.ACCEPTED,
            username: fromUser.username,
            avatar: fromUser.avatar,
          },
          collection: FirestoreCollection.FRIENDSHIPS,
        }),

        // send push notif
        notifyAcceptFriendRequest({
          recipientUserID: from,
          senderUserID: to,
        }),
      ]);
      return {
        sitRep: {
          forward: _forward.status,
          reverse: _reverse.status,
        },
        message: comment,
        status: FriendshipStatus.ACCEPTED,
      };
    }
  }
  // if no existing relationship at all -> create friend requests for both pov
  const comment = `You have no existing relationship with ${to}`;
  console.log(comment);
  const createMutualFriendRequest = async ({
    primaryUserID,
    friendID,
    initiatedBy,
    note,
    utmAttribution,
    username,
    avatar,
  }: {
    primaryUserID: UserID;
    friendID: UserID;
    initiatedBy: UserID;
    note?: string;
    utmAttribution?: string;
    username: Username;
    avatar: string;
  }) => {
    /**
     * When a friend request is made, two friendship documents are created:
     * - You (initiator) status = WAITING (you are waiting on this friend to accept)
     * - Them (recipient) status = REQUEST (they see a request from you)
     *
     * The logic of WAITING vs REQUEST is based on the perspective of the primaryUserID looking at the other person in the friendship
     */
    const friendshipID = uuidv4() as FriendshipID;
    const friendRequest: Friendship_Firestore = {
      id: friendshipID,
      primaryUserID,
      friendID,
      friendNickname: "",
      username,
      avatar,
      note: note || "",
      initiatedBy: initiatedBy,
      utmAttribution: utmAttribution || "",
      createdAt: createFirestoreTimestamp(),
      status:
        primaryUserID === initiatedBy
          ? FriendshipStatus.SENT_REQUEST
          : FriendshipStatus.GOT_REQUEST,
      requestNonce: 1,
    };
    console.log(`friendRequest`, friendRequest);
    const result = await createFirestoreDoc<FriendshipID, Friendship_Firestore>(
      {
        id: friendshipID,
        data: friendRequest,
        collection: FirestoreCollection.FRIENDSHIPS,
      }
    );
    return result;
  };
  const [_forward, _reverse, resPush] = await Promise.all([
    createMutualFriendRequest({
      primaryUserID: from,
      friendID: to,
      initiatedBy: from,
      note: request.note || "",
      utmAttribution: request.utmAttribution || "",
      username: toUser.username,
      avatar: toUser.avatar,
    }),
    createMutualFriendRequest({
      primaryUserID: to,
      friendID: from,
      initiatedBy: from,
      note: request.note || "",
      utmAttribution: request.utmAttribution || "",
      username: fromUser.username,
      avatar: fromUser.avatar,
    }),
    notifySentFriendRequest({
      recipientUserID: to,
      senderUserID: from,
    }),
  ]);
  return {
    sitRep: {
      forward: _forward.status,
      reverse: _reverse.status,
    },
    message: comment,
    status: FriendshipStatus.SENT_REQUEST,
  };
};

type PartialViewPublicProfileResponseSuccess = Omit<
  ViewPublicProfileResponseSuccess,
  "stories"
> & {
  stories: Partial<Story>[];
};

export const getPublicProfile = async ({
  username,
  userID,
  requesterID,
}: {
  username?: Username;
  userID?: UserID;
  requesterID?: UserID | null;
}): Promise<PartialViewPublicProfileResponseSuccess> => {
  // handle the case where its full anon
  if (!requesterID) {
    console.log(`Its an anon request`);
    try {
      const matchedUser = await retrieveUserBasedOnIdOrUsername({
        username,
        userID,
      });
      if (matchedUser.privacyMode === privacyModeEnum.hidden) {
        // allow hidden user to be found by userID but not username
        if (matchedUser.id === userID) {
          return {
            id: matchedUser.id,
            username: matchedUser.username,
            avatar: matchedUser.avatar,
            displayName: matchedUser.displayName,
            bio: matchedUser.bio,
            stories: [],
            privacyMode: matchedUser.privacyMode as unknown as PrivacyModeEnum,
          };
        }
        // hide user if only provided username
        return UNKNOWN_USER;
      }
      if (matchedUser.privacyMode === privacyModeEnum.private) {
        const stories = await listFirestoreDocsDoubleWhere<Story_Firestore>({
          where1: {
            field: "userID",
            operator: "==",
            value: matchedUser.id,
          },
          where2: {
            field: "pinned",
            operator: "==",
            value: true,
          },
          collection: FirestoreCollection.STORIES,
        });
        return {
          id: matchedUser.id,
          username: matchedUser.username,
          avatar: matchedUser.avatar,
          displayName: matchedUser.displayName,
          bio: matchedUser.bio,
          stories: stories
            .filter((s) => !s.deleted && s.showcase)
            .map((s) => convertStoryToGraphQL(s)),
          privacyMode: matchedUser.privacyMode as unknown as PrivacyModeEnum,
        };
      }
      if (matchedUser.privacyMode === privacyModeEnum.public) {
        const stories = await listFirestoreDocsDoubleWhere<Story_Firestore>({
          where1: {
            field: "userID",
            operator: "==",
            value: matchedUser.id,
          },
          where2: {
            field: "showcase",
            operator: "==",
            value: true,
          },
          collection: FirestoreCollection.STORIES,
        });
        return {
          id: matchedUser.id,
          username: matchedUser.username,
          avatar: matchedUser.avatar,
          displayName: matchedUser.displayName,
          bio: matchedUser.bio,
          stories: stories
            .filter((s) => !s.deleted)
            .map((s) => convertStoryToGraphQL(s)),
          privacyMode: matchedUser.privacyMode as unknown as PrivacyModeEnum,
        };
      }
      return UNKNOWN_USER;
    } catch (e) {
      return UNKNOWN_USER;
    }
  }
  console.log(`Its an authenticated request from ${requesterID}`);
  try {
    // handle the case where theres a user
    const [selfUser, matchedUser] = await Promise.all([
      getFirestoreDoc<UserID, User_Firestore>({
        id: requesterID,
        collection: FirestoreCollection.USERS,
      }),
      retrieveUserBasedOnIdOrUsername({
        username,
        userID,
      }),
    ]);
    const [_forward, _reverse] = await Promise.all([
      checkExistingFriendship({
        to: matchedUser.id,
        from: requesterID,
      }),
      checkExistingFriendship({
        to: requesterID,
        from: matchedUser.id,
      }),
    ]);
    // update the friendships with latest username & avatar
    if (_forward && _forward.length > 0 && _reverse && _reverse.length > 0) {
      const _f = _forward[0];
      const _r = _reverse[0];
      await Promise.all([
        updateFirestoreDoc<FriendshipID, Friendship_Firestore>({
          id: _f.id,
          payload: {
            username: matchedUser.username,
            avatar: matchedUser.avatar,
          },
          collection: FirestoreCollection.FRIENDSHIPS,
        }),
        updateFirestoreDoc<FriendshipID, Friendship_Firestore>({
          id: _r.id,
          payload: {
            username: selfUser.username,
            avatar: selfUser.avatar,
          },
          collection: FirestoreCollection.FRIENDSHIPS,
        }),
      ]);
    }
    const friendship = _forward[0];
    console.log(`Found ${_forward.length} friendship logs`, friendship);
    // not friends
    if (!friendship || friendship.status !== FriendshipStatus.ACCEPTED) {
      if (matchedUser.privacyMode === privacyModeEnum.hidden) {
        // allow hidden user to be found by userID but not username
        if (matchedUser.id === userID) {
          return {
            id: matchedUser.id,
            username: matchedUser.username,
            avatar: matchedUser.avatar,
            displayName: matchedUser.displayName,
            bio: matchedUser.bio,
            stories: [],
            privacyMode: matchedUser.privacyMode as unknown as PrivacyModeEnum,
          };
        }
        return UNKNOWN_USER;
      }
      if (matchedUser.privacyMode === privacyModeEnum.private) {
        const stories = await listFirestoreDocsDoubleWhere<Story_Firestore>({
          where1: {
            field: "userID",
            operator: "==",
            value: matchedUser.id,
          },
          where2: {
            field: "pinned",
            operator: "==",
            value: true,
          },
          collection: FirestoreCollection.STORIES,
        });
        return {
          id: matchedUser.id,
          username: matchedUser.username,
          avatar: matchedUser.avatar,
          displayName: matchedUser.displayName,
          bio: matchedUser.bio,
          stories: stories
            .filter((s) => !s.deleted && s.showcase)
            .map((s) => convertStoryToGraphQL(s)),
          privacyMode: matchedUser.privacyMode as unknown as PrivacyModeEnum,
        };
      }
      if (matchedUser.privacyMode === privacyModeEnum.public) {
        const stories = await listFirestoreDocsDoubleWhere<Story_Firestore>({
          where1: {
            field: "userID",
            operator: "==",
            value: matchedUser.id,
          },
          where2: {
            field: "showcase",
            operator: "==",
            value: true,
          },
          collection: FirestoreCollection.STORIES,
        });
        return {
          id: matchedUser.id,
          username: matchedUser.username,
          avatar: matchedUser.avatar,
          displayName: matchedUser.displayName,
          bio: matchedUser.bio,
          stories: stories
            .filter((s) => !s.deleted)
            .map((s) => convertStoryToGraphQL(s)),
          privacyMode: matchedUser.privacyMode as unknown as PrivacyModeEnum,
        };
      }
      return UNKNOWN_USER;
    }
    // are friends
    if (friendship.status === FriendshipStatus.ACCEPTED) {
      const stories = await listFirestoreDocsDoubleWhere<Story_Firestore>({
        where1: {
          field: "userID",
          operator: "==",
          value: matchedUser.id,
        },
        where2: {
          field: "showcase",
          operator: "==",
          value: true,
        },
        collection: FirestoreCollection.STORIES,
      });
      return {
        id: matchedUser.id,
        username: matchedUser.username,
        avatar: matchedUser.avatar,
        displayName: matchedUser.displayName,
        bio: matchedUser.bio,
        stories: stories
          .filter((s) => !s.deleted)
          .map((s) => convertStoryToGraphQL(s)),
        privacyMode: matchedUser.privacyMode as unknown as PrivacyModeEnum,
      };
    }
    return UNKNOWN_USER;
  } catch (e) {
    console.log(e);
    return UNKNOWN_USER;
  }
};

const retrieveUserBasedOnIdOrUsername = async ({
  username,
  userID,
}: {
  username?: Username;
  userID?: UserID;
}) => {
  if (userID) {
    try {
      const user = await getFirestoreDoc<UserID, User_Firestore>({
        id: userID,
        collection: FirestoreCollection.USERS,
      });
      return user;
    } catch (e) {
      console.log(e);
      console.log(`Will keep trying, with username next`);
    }
  }
  if (username && username.toLowerCase() !== "user") {
    const matchingUsers = await listFirestoreDocs<User_Firestore>({
      where: {
        field: "username",
        operator: "==",
        value: username,
      },
      collection: FirestoreCollection.USERS,
    });
    const matchedUser = matchingUsers[0];
    if (!matchedUser) {
      throw Error(`Could not find user with username ${username}`);
    }
    return matchedUser;
  }
  throw Error(
    `Must provide either username or userID. You gave username=${username} and userID=${userID}`
  );
};

interface ManageFriendshipFirestoreProps {
  userID: UserID;
  friendID: UserID;
  action: FriendshipAction;
}
export const manageFriendshipFirestore = async ({
  userID,
  friendID,
  action,
}: ManageFriendshipFirestoreProps) => {
  const [selfUser, friendUser] = await Promise.all([
    getFirestoreDoc<UserID, User_Firestore>({
      id: userID,
      collection: FirestoreCollection.USERS,
    }),
    getFirestoreDoc<UserID, User_Firestore>({
      id: friendID,
      collection: FirestoreCollection.USERS,
    }),
  ]);
  if (!selfUser || !friendUser) {
    throw Error(`Could not find user`);
  }
  const [forwardRelation, reverseRelation] = await Promise.all([
    checkExistingFriendship({
      to: friendID,
      from: userID,
    }),
    checkExistingFriendship({
      to: userID,
      from: friendID,
    }),
  ]);
  const forward = forwardRelation[0];
  const reverse = reverseRelation[0];
  // if an existing relationship is found
  if (!forward || !reverse) {
    throw Error(`Could not find existing friendship`);
  }
  // update the friendship
  switch (action) {
    case FriendshipAction.Block: {
      const [_forward, _reverse] = await Promise.all([
        updateFirestoreDoc<FriendshipID, Friendship_Firestore>({
          id: forward.id,
          payload: {
            status: FriendshipStatus.BLOCKED,
            initiatedBy: userID,
            username: friendUser.username,
            avatar: friendUser.avatar,
          },
          collection: FirestoreCollection.FRIENDSHIPS,
        }),
        updateFirestoreDoc<FriendshipID, Friendship_Firestore>({
          id: reverse.id,
          payload: {
            status: FriendshipStatus.NONE,
            username: selfUser.username,
            avatar: selfUser.avatar,
          },
          collection: FirestoreCollection.FRIENDSHIPS,
        }),
      ]);
      return FriendshipStatusEnum.Blocked;
    }
    case FriendshipAction.Unblock: {
      const [_forward] = await Promise.all([
        updateFirestoreDoc<FriendshipID, Friendship_Firestore>({
          id: forward.id,
          payload: {
            status: FriendshipStatus.NONE,
            username: friendUser.username,
            avatar: friendUser.avatar,
          },
          collection: FirestoreCollection.FRIENDSHIPS,
        }),
      ]);
      return FriendshipStatusEnum.None;
    }
    case FriendshipAction.AcceptRequest: {
      if (
        forward.status === FriendshipStatus.GOT_REQUEST &&
        reverse.status === FriendshipStatus.SENT_REQUEST
      ) {
        const [_forward, _reverse] = await Promise.all([
          updateFirestoreDoc<FriendshipID, Friendship_Firestore>({
            id: forward.id,
            payload: {
              status: FriendshipStatus.ACCEPTED,
              username: friendUser.username,
              avatar: friendUser.avatar,
            },
            collection: FirestoreCollection.FRIENDSHIPS,
          }),
          updateFirestoreDoc<FriendshipID, Friendship_Firestore>({
            id: reverse.id,
            payload: {
              status: FriendshipStatus.ACCEPTED,
              username: selfUser.username,
              avatar: selfUser.avatar,
            },
            collection: FirestoreCollection.FRIENDSHIPS,
          }),
        ]);
        await notifyAcceptFriendRequest({
          recipientUserID: friendID,
          senderUserID: userID,
        });
        return FriendshipStatusEnum.Accepted;
      } else {
        throw Error(
          `Could not find existing friend request between ${FriendshipStatus.GOT_REQUEST} you=${userID} and ${FriendshipStatus.SENT_REQUEST} friend=${friendID}`
        );
      }
    }
    case FriendshipAction.DeclineRequest: {
      if (
        forward.status === FriendshipStatus.GOT_REQUEST &&
        reverse.status === FriendshipStatus.SENT_REQUEST
      ) {
        const [_forward, _reverse] = await Promise.all([
          updateFirestoreDoc<FriendshipID, Friendship_Firestore>({
            id: forward.id,
            payload: {
              status: FriendshipStatus.NONE,
              username: friendUser.username,
              avatar: friendUser.avatar,
            },
            collection: FirestoreCollection.FRIENDSHIPS,
          }),
          updateFirestoreDoc<FriendshipID, Friendship_Firestore>({
            id: reverse.id,
            payload: {
              status: FriendshipStatus.DECLINED,
              username: selfUser.username,
              avatar: selfUser.avatar,
            },
            collection: FirestoreCollection.FRIENDSHIPS,
          }),
        ]);
        return FriendshipStatusEnum.Declined;
      } else {
        throw Error(
          `Could not find existing friend request between ${FriendshipStatus.GOT_REQUEST} you=${userID} and ${FriendshipStatus.SENT_REQUEST} friend=${friendID}`
        );
      }
    }
    case FriendshipAction.CancelRequest: {
      if (
        forward.status === FriendshipStatus.SENT_REQUEST &&
        reverse.status === FriendshipStatus.GOT_REQUEST
      ) {
        const [_forward, _reverse] = await Promise.all([
          updateFirestoreDoc<FriendshipID, Friendship_Firestore>({
            id: forward.id,
            payload: {
              status: FriendshipStatus.NONE,
              username: friendUser.username,
              avatar: friendUser.avatar,
            },
            collection: FirestoreCollection.FRIENDSHIPS,
          }),
          updateFirestoreDoc<FriendshipID, Friendship_Firestore>({
            id: reverse.id,
            payload: {
              status: FriendshipStatus.NONE,
              username: selfUser.username,
              avatar: selfUser.avatar,
            },
            collection: FirestoreCollection.FRIENDSHIPS,
          }),
        ]);
        return FriendshipStatusEnum.None;
      } else {
        throw Error(
          `Could not find existing friend request between ${FriendshipStatus.SENT_REQUEST} you=${userID} and ${FriendshipStatus.GOT_REQUEST} friend=${friendID}`
        );
      }
    }
    case FriendshipAction.RemoveFriend: {
      if (
        forward.status === FriendshipStatus.ACCEPTED &&
        reverse.status === FriendshipStatus.ACCEPTED
      ) {
        const [_forward, _reverse] = await Promise.all([
          updateFirestoreDoc<FriendshipID, Friendship_Firestore>({
            id: forward.id,
            payload: {
              status: FriendshipStatus.NONE,
              initiatedBy: userID,
              username: friendUser.username,
              avatar: friendUser.avatar,
            },
            collection: FirestoreCollection.FRIENDSHIPS,
          }),
          updateFirestoreDoc<FriendshipID, Friendship_Firestore>({
            id: reverse.id,
            payload: {
              status: FriendshipStatus.NONE,
              username: selfUser.username,
              avatar: selfUser.avatar,
            },
            collection: FirestoreCollection.FRIENDSHIPS,
          }),
        ]);
        return FriendshipStatusEnum.None;
      } else {
        throw Error(
          `Could not find existing friendship between ${FriendshipStatus.ACCEPTED} you=${userID} and ${FriendshipStatus.ACCEPTED} friend=${friendID}`
        );
      }
    }
    default: {
      throw Error(`Invalid action ${action}`);
    }
  }
};

const UNKNOWN_USER = {
  id: "notfound",
  username: "unknown",
  bio: "",
  avatar: placeholderImageThumbnail,
  displayName: "User Not Found",
  stories: [],
  privacyMode: PrivacyModeEnum.Hidden,
};
