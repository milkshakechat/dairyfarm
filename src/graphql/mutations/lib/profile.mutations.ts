import { authGuardHTTP } from "@/graphql/authGuard";
import {
  MarkNotificationsAsReadResponse,
  ModifyProfileResponse,
  MutationMarkNotificationsAsReadArgs,
  MutationModifyProfileArgs,
  MutationUpdatePushTokenArgs,
  RevokePushTokensResponse,
  UpdatePushTokenResponse,
} from "@/graphql/types/resolvers-types";
import { updateFirestoreDoc } from "@/services/firestore";
import { getPlaceDetails, updateGeoField } from "@/services/geolocation";

import { markNotifications } from "@/services/notification";
import {
  deactivatePushToken,
  revokeAllPushTokens,
  saveOrUpdatePushToken,
} from "@/services/push";
import { updateSendbirdUser } from "@/services/sendbird";
import {
  FirestoreCollection,
  GeoInfo,
  GoogleMapsPlaceID,
  MirrorPublicUser_Firestore,
  NotificationID,
  UserID,
  User_Firestore,
  Username,
} from "@milkshakechat/helpers";
import { GraphQLResolveInfo } from "graphql";

export const modifyProfile = async (
  _parent: any,
  args: MutationModifyProfileArgs,
  _context: any,
  _info: any
) => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw Error("No user ID found");
  }
  // @ts-ignore
  const payload: Partial<User_Firestore> = {
    ...args.input,
  };
  if (args.input.geoPlaceID) {
    await updateGeoField<UserID, User_Firestore>({
      id: userID,
      placeID: args.input.geoPlaceID as GoogleMapsPlaceID,
      collection: FirestoreCollection.USERS,
    });
  }
  const user = await updateFirestoreDoc<UserID, User_Firestore>({
    id: userID,
    payload,
    collection: FirestoreCollection.USERS,
  });
  if (user.sendBirdUserID) {
    await updateSendbirdUser({
      userID: userID,
      displayName: user.displayName,
      profileUrl: user.avatar,
    });
  }
  // public user mirror
  if (args.input.username || args.input.avatar) {
    let p: Partial<MirrorPublicUser_Firestore> = {};
    if (args.input.username) {
      p.username = args.input.username as Username;
    }
    if (args.input.avatar) {
      p.avatar = args.input.avatar;
    }
    const userMirror = await updateFirestoreDoc({
      id: userID,
      payload: p,
      collection: FirestoreCollection.MIRROR_USER,
    });
    if (!userMirror) {
      throw Error("No user mirror found");
    }
  }
  return {
    user: {
      ...user,
      currency: user.currency || undefined,
      prefGeoBias: user.prefGeoBias || undefined,
      prefAboutMe: user.prefAboutMe || undefined,
      prefLookingFor: user.prefLookingFor || undefined,
      location: user.geoInfo
        ? {
            title: user.geoInfo.title || "",
            geoHash: user.geoFireX?.geohash || "",
            latitude: user.geoInfo.lat || 0,
            longitude: user.geoInfo.lng || 0,
          }
        : undefined,
    },
  };
};

export const updatePushToken = async (
  _parent: any,
  args: MutationUpdatePushTokenArgs,
  _context: any,
  _info: any
) => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw Error("No user ID found");
  }
  if (!args.input.token) {
    throw Error("No push token found");
  }
  if (args.input.active) {
    // save or update a push token
    const status = await saveOrUpdatePushToken({
      userID,
      token: args.input.token,
      title: args.input.title || "",
    });
    return {
      status,
    };
  } else {
    // deactivate a push token
    const status = await deactivatePushToken({
      userID,
      token: args.input.token,
    });
    return {
      status,
    };
  }
};

export const revokePushTokens = async (
  _parent: any,
  args: any,
  _context: any,
  _info: any
): Promise<RevokePushTokensResponse> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw Error("No user ID found");
  }
  const status = await revokeAllPushTokens(userID);
  return {
    status,
  };
};

export const markNotificationsAsRead = async (
  _parent: any,
  args: MutationMarkNotificationsAsReadArgs,
  _context: any,
  _info: any
): Promise<MarkNotificationsAsReadResponse> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw Error("No user ID found");
  }
  const [readNotifs, unreadNotifs] = await Promise.all([
    markNotifications({
      markedRead: true,
      notificationIDs: args.input.read as NotificationID[],
    }),
    markNotifications({
      markedRead: false,
      notificationIDs: args.input.unread as NotificationID[],
    }),
  ]);
  const notifs = [...readNotifs, ...unreadNotifs];
  return {
    notifications: notifs.map((n) => {
      return {
        id: n.id,
        title: n.title,
        description: n.body,
        route: n.route,
        thumbnail: n.image,
        relatedChatRoomID: n.relatedChatRoomID,
        createdAt: (n.createdAt as any).toDate(),
        markedRead: n.markedRead,
      };
    }),
  };
};

export const responses = {
  ModifyProfileResponse: {
    __resolveType(
      obj: ModifyProfileResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("user" in obj) {
        return "ModifyProfileResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
  UpdatePushTokenResponse: {
    __resolveType(
      obj: UpdatePushTokenResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("status" in obj) {
        return "UpdatePushTokenResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
  RevokePushTokensResponse: {
    __resolveType(
      obj: RevokePushTokensResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("status" in obj) {
        return "RevokePushTokensResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
  MarkNotificationsAsReadResponse: {
    __resolveType(
      obj: MarkNotificationsAsReadResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("notifications" in obj) {
        return "MarkNotificationsAsReadResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
};
