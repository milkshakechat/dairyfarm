import {
  SendFriendRequestInput,
  ViewPublicProfileResponseSuccess,
} from "@/graphql/types/resolvers-types";
import {
  FirestoreCollection,
  FriendshipID,
  FriendshipStatus,
  Friendship_Firestore,
  UserID,
  Username,
  privacyModeEnum,
} from "@milkshakechat/helpers";
import {
  createFirestoreDoc,
  createFirestoreTimestamp,
  getFirestoreDoc,
  listFirestoreDocs,
  updateFirestoreDoc,
} from "@/services/firestore";
import { v4 as uuidv4 } from "uuid";
import { User_Firestore } from "@milkshakechat/helpers";
import { firestore } from "@/services/firebase";
import { Query, QueryDocumentSnapshot } from "firebase-admin/firestore";

export const checkUserPrivacy = async (
  userID: UserID
): Promise<privacyModeEnum> => {
  const user = await getFirestoreDoc<UserID, User_Firestore>({
    id: userID,
    collection: FirestoreCollection.USERS,
  });
  return user.privacyMode;
};

interface NextFriendshipStatus {
  sitRep: {
    to: FriendshipStatus;
    from: FriendshipStatus;
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
  const checkExistingFriendship = async ({
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
  if (forward && forward) {
    // if recipient blocked you --> reject
    if (reverse.status === FriendshipStatus.BLOCKED) {
      const comment = `You have been blocked by ${to}`;
      console.log(comment);
      return {
        sitRep: {
          to: forward.status,
          from: reverse.status,
        },
        message: comment,
        status: FriendshipStatus.BLOCKED,
      };
    }
    // if you blocked recipient --> unblock & re-send request
    if (forward.status === FriendshipStatus.BLOCKED) {
      // unblock them & set status REQUESTED
      const _forward = await updateFirestoreDoc<
        FriendshipID,
        Friendship_Firestore
      >({
        id: forward.id,
        payload: {
          status: FriendshipStatus.REQUESTED,
          initiatedBy: from,
          requestNonce: forward.requestNonce + 1,
        },
        collection: FirestoreCollection.FRIENDSHIPS,
      });
      // re-send request & update nonce
      // assumes the recipient hasnt blocked you (this logic is handled in above if statement)
      const _reverse = await updateFirestoreDoc<
        FriendshipID,
        Friendship_Firestore
      >({
        id: reverse.id,
        payload: {
          status: FriendshipStatus.REQUESTED,
          initiatedBy: from,
          requestNonce: forward.requestNonce + 1,
        },
        collection: FirestoreCollection.FRIENDSHIPS,
      });
      // return sitrep
      const comment = `You previously blocked ${to} but have now unblocked them & resent a friend request`;
      console.log(comment);
      return {
        sitRep: {
          to: _forward.status,
          from: _reverse.status,
        },
        message: comment,
        status: FriendshipStatus.REQUESTED,
      };
    }
    // if has prior friendship but now NONE --> re-send request
    if (forward.status === FriendshipStatus.NONE) {
      // re-send request & update nonce
      const _forward = await updateFirestoreDoc<
        FriendshipID,
        Friendship_Firestore
      >({
        id: forward.id,
        payload: {
          status: FriendshipStatus.REQUESTED,
          initiatedBy: from,
          requestNonce: forward.requestNonce + 1,
        },
        collection: FirestoreCollection.FRIENDSHIPS,
      });
      // re-send request & update nonce
      // assumes the recipient hasnt blocked you (this logic is handled in above if statement)
      const _reverse = await updateFirestoreDoc<
        FriendshipID,
        Friendship_Firestore
      >({
        id: reverse.id,
        payload: {
          status: FriendshipStatus.REQUESTED,
          initiatedBy: from,
          requestNonce: forward.requestNonce + 1,
        },
        collection: FirestoreCollection.FRIENDSHIPS,
      });
      // return sitrep
      const comment = `You previously had a friendship with ${to} but now do not. A friend request has been re-sent`;
      console.log(comment);
      return {
        sitRep: {
          to: _forward.status,
          from: _reverse.status,
        },
        message: comment,
        status: FriendshipStatus.REQUESTED,
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
          to: forward.status,
          from: reverse.status,
        },
        message: comment,
        status: FriendshipStatus.ACCEPTED,
      };
    }
    // if existing request from you -> update requestNonce
    if (
      (forward.status === FriendshipStatus.REQUESTED &&
        reverse.status === FriendshipStatus.REQUESTED) ||
      reverse.status === FriendshipStatus.DECLINED
    ) {
      const comment =
        reverse.status === FriendshipStatus.DECLINED
          ? `They rejected your prior friend request but you have re-sent another friend request to ${to}`
          : `You already sent a friend request & are waiting to hear back from ${to}`;
      console.log(comment);
      // re-send request & update nonce
      const _forward = await updateFirestoreDoc<
        FriendshipID,
        Friendship_Firestore
      >({
        id: forward.id,
        payload: {
          status: FriendshipStatus.REQUESTED,
          initiatedBy: from,
          requestNonce: forward.requestNonce + 1,
        },
        collection: FirestoreCollection.FRIENDSHIPS,
      });
      // re-send request & update nonce
      // assumes reciepient hasnt blocked you
      const _reverse = await updateFirestoreDoc<
        FriendshipID,
        Friendship_Firestore
      >({
        id: reverse.id,
        payload: {
          status: FriendshipStatus.REQUESTED,
          initiatedBy: from,
          requestNonce: forward.requestNonce + 1,
        },
        collection: FirestoreCollection.FRIENDSHIPS,
      });
      return {
        sitRep: {
          to: _forward.status,
          from: _reverse.status,
        },
        message: comment,
        status: FriendshipStatus.REQUESTED,
      };
    }
    // if existing request from recipient -> auto accept
    // because you are sending them a friend request when they already sent you one, it can be assumed as an acceptance
    // assume you havent blocked them (handled above)
    if (reverse.status === FriendshipStatus.REQUESTED) {
      const comment = `You accepted an existing friend request from ${to}`;
      console.log(comment);
      // update the existing friend request from their POV (reverse)
      const _reverse = await updateFirestoreDoc<
        FriendshipID,
        Friendship_Firestore
      >({
        id: reverse.id,
        payload: {
          status: FriendshipStatus.ACCEPTED,
        },
        collection: FirestoreCollection.FRIENDSHIPS,
      });
      // accept their friend request from your POV (forward)
      const _forward = await updateFirestoreDoc<
        FriendshipID,
        Friendship_Firestore
      >({
        id: forward.id,
        payload: {
          status: FriendshipStatus.ACCEPTED,
        },
        collection: FirestoreCollection.FRIENDSHIPS,
      });
      return {
        sitRep: {
          to: _forward.status,
          from: _reverse.status,
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
  }: {
    primaryUserID: UserID;
    friendID: UserID;
    initiatedBy: UserID;
    note?: string;
    utmAttribution?: string;
  }) => {
    const friendshipID = uuidv4() as FriendshipID;
    const friendRequest: Friendship_Firestore = {
      id: friendshipID,
      primaryUserID,
      friendID,
      friendNickname: "",
      note: note || "",
      initiatedBy: initiatedBy,
      utmAttribution: utmAttribution || "",
      createdAt: createFirestoreTimestamp(),
      status: FriendshipStatus.REQUESTED,
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
  const [_forward, _reverse] = await Promise.all([
    createMutualFriendRequest({
      primaryUserID: from,
      friendID: to,
      initiatedBy: from,
      note: request.note || "",
      utmAttribution: request.utmAttribution || "",
    }),
    createMutualFriendRequest({
      primaryUserID: to,
      friendID: from,
      initiatedBy: from,
      note: request.note || "",
      utmAttribution: request.utmAttribution || "",
    }),
  ]);
  return {
    sitRep: {
      to: _forward.status,
      from: _reverse.status,
    },
    message: comment,
    status: FriendshipStatus.REQUESTED,
  };
};

export const getPublicProfile = async (
  username: Username
): Promise<ViewPublicProfileResponseSuccess> => {
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
  const publicProfile: ViewPublicProfileResponseSuccess = {
    id: matchedUser.id,
    username: matchedUser.username,
  };
  if (matchedUser.avatar) {
    publicProfile.avatar = matchedUser.avatar;
  }
  return publicProfile;
};
