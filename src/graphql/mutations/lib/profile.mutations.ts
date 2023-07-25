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

import { markNotifications } from "@/services/notification";
import {
  deactivatePushToken,
  revokeAllPushTokens,
  saveOrUpdatePushToken,
} from "@/services/push";
import { FirestoreCollection, NotificationID } from "@milkshakechat/helpers";
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
  const user = await updateFirestoreDoc({
    id: userID,
    payload: args.input,
    collection: FirestoreCollection.USERS,
  });
  return {
    user,
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
