import { authGuardHTTP } from "@/graphql/authGuard";
import {
  ModifyProfileResponse,
  MutationDemoMutationArgs,
  MutationModifyProfileArgs,
  MutationUpdatePushTokenArgs,
  UpdatePushTokenResponse,
} from "@/graphql/types/resolvers-types";
import { updateFirestoreDoc } from "@/services/firestore";
import {
  deactivatePushToken,
  saveOrUpdatePushToken,
} from "@/services/push-notifications";
import { FirestoreCollection } from "@milkshakechat/helpers";
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
  console.log(`Got the request to update push notification token`);
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
};
