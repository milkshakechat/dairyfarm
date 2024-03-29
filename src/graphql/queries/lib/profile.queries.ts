import { authGuardHTTP, getUserIDFromAuthToken } from "@/graphql/authGuard";
import {
  CheckUsernameAvailableResponse,
  FetchRecentNotificationsResponse,
  FetchRecentNotificationsResponseSuccess,
  GetMyProfileResponse,
  QueryCheckUsernameAvailableArgs,
  User,
} from "@/graphql/types/resolvers-types";
import {
  getFirestoreDoc,
  listFirestoreDocs,
  listFirestoreDocsDoubleWhere,
} from "@/services/firestore";
import { checkIfUsernameAvailable } from "@/utils/username";
import {
  CurrencyEnum,
  FirestoreCollection,
  Friendship_Firestore,
  Notification_Firestore,
  Story_Firestore,
  UserID,
  User_Firestore,
  checkIfUsernameIsAllowed,
} from "@milkshakechat/helpers";
import { GraphQLResolveInfo } from "graphql";
import { ListContactsResponse } from "../../types/resolvers-types";
import { getSendbirdUser } from "@/services/sendbird";
import { convertStoryToGraphQL } from "@/services/story";
import * as admin from "firebase-admin";
import { firestore } from "@/services/firebase";
import { Query, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { getFxRates } from "@/services/fx";

export const getMyProfile = async (
  _parent: any,
  args: any,
  _context: any,
  _info: any
) => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw new Error("No userID found");
  }
  try {
    const [
      user,
      // sendbirdUser
    ] = await Promise.all([
      getFirestoreDoc<UserID, User_Firestore>({
        id: userID,
        collection: FirestoreCollection.USERS,
      }),
      // getSendbirdUser({
      //   userID,
      // }),
    ]);
    const fxRate =
      user.currency === CurrencyEnum.USD
        ? 1.0
        : (
            await getFxRates({
              from: CurrencyEnum.USD,
              to: user.currency || CurrencyEnum.USD,
            })
          ).toRate;

    return {
      user: {
        ...user,
        // sendBirdAccessToken: sendbirdUser.access_token,
        createdAt: (user.createdAt as any).toDate(),
        defaultPaymentMethodID:
          user.stripeMetadata?.defaultPaymentMethodID || undefined,
        location: user.geoInfo
          ? {
              title: user.geoInfo.title || "",
              geoHash: user.geoFireX?.geohash || "",
              latitude: user.geoInfo.lat || 0,
              longitude: user.geoInfo.lng || 0,
            }
          : undefined,
        prefGeoBias: user.prefGeoBias || undefined,
        prefAboutMe: user.prefAboutMe || undefined,
        prefLookingFor: user.prefLookingFor || undefined,
        currency: user.currency || CurrencyEnum.USD,
        fxRateFromUSD: fxRate,
      },
    };
  } catch (e) {
    console.log(e);
    throw new Error("Failed to get user profile");
  }
};

export const checkUsernameAvailable = async (
  _parent: any,
  args: QueryCheckUsernameAvailableArgs,
  _context: any,
  _info: any
) => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  const isAvail = await checkIfUsernameAvailable(args.input.username);
  const isAllowed = checkIfUsernameIsAllowed(args.input.username);
  return {
    isAvailable: isAvail && isAllowed,
  };
};

export const listContacts = async (
  _parent: any,
  args: any,
  _context: any,
  _info: any
) => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw new Error("No userID found");
  }
  // get friendships
  const friendships = await listFirestoreDocs<Friendship_Firestore>({
    where: {
      field: "primaryUserID",
      operator: "==",
      value: userID,
    },
    collection: FirestoreCollection.FRIENDSHIPS,
  });
  const contacts = friendships.map((fr) => {
    return {
      friendID: fr.friendID,
      username: fr.username,
      displayName: fr.friendNickname,
      avatar: fr.avatar,
      status: fr.status,
    };
  });
  return {
    contacts,
  };
};

export const fetchRecentNotifications = async (
  _parent: any,
  args: any,
  _context: any,
  _info: any
): Promise<FetchRecentNotificationsResponseSuccess> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });

  const ref = firestore
    .collection(FirestoreCollection.NOTIFICATIONS)
    .where("recipientID", "==", userID)
    .limit(100) as Query<Notification_Firestore>;

  const collectionItems = await ref.get();

  if (collectionItems.empty) {
    return {
      notifications: [],
    };
  } else {
    const notifications = collectionItems.docs.map(
      (doc: QueryDocumentSnapshot<Notification_Firestore>) => {
        const data = doc.data();
        return {
          id: data.id,
          title: data.title,
          description: data.body,
          route: data.route,
          thumbnail: data.image,
          relatedChatRoomID: data.relatedChatRoomID,
          createdAt: (data.createdAt as any).toDate(),
          markedRead: data.markedRead,
        };
      }
    );
    return {
      notifications,
    };
  }
};

export const responses = {
  GetMyProfileResponse: {
    __resolveType(
      obj: GetMyProfileResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("user" in obj) {
        return "GetMyProfileResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
  CheckUsernameAvailableResponse: {
    __resolveType(
      obj: CheckUsernameAvailableResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("isAvailable" in obj) {
        return "CheckUsernameAvailableResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
  ListContactsResponse: {
    __resolveType(
      obj: ListContactsResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("contacts" in obj) {
        return "ListContactsResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
  FetchRecentNotificationsResponse: {
    __resolveType(
      obj: FetchRecentNotificationsResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("notifications" in obj) {
        return "FetchRecentNotificationsResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
};

export const CustomProfileResolvers = {
  User: {
    stories: async (
      _parent: User,
      args: any,
      _context: any,
      _info: any
    ): Promise<any | null> => {
      const selfUserID = await getUserIDFromAuthToken(_context);
      if (selfUserID === _parent.id) {
        // own profile
        const stories = await listFirestoreDocs<Story_Firestore>({
          where: {
            field: "userID",
            operator: "==",
            value: selfUserID,
          },
          collection: FirestoreCollection.STORIES,
        });
        return stories.map((s) => convertStoryToGraphQL(s));
      } else {
        const now = admin.firestore.Timestamp.now();
        // other users profile
        const stories = await listFirestoreDocs<Story_Firestore>({
          where: {
            field: "userID",
            operator: "==",
            value: _parent.id,
          },
          collection: FirestoreCollection.STORIES,
        });
        return stories
          .filter((s) => !s.deleted)
          .map((s) => convertStoryToGraphQL(s));
      }
    },
  },
};
