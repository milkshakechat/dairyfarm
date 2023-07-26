import { authGuardHTTP } from "@/graphql/authGuard";
import {
  FriendshipStatus,
  ManageFriendshipResponse,
  MutationManageFriendshipArgs,
  MutationSendFreeChatArgs,
  MutationSendFriendRequestArgs,
  MutationUpdateChatSettingsArgs,
  SendFreeChatResponse,
  SendFriendRequestResponse,
  UpdateChatSettingsResponse,
} from "../../types/resolvers-types";
import {
  manageFriendshipFirestore,
  sendFriendRequestFirestore,
} from "@/services/friends";
import { GraphQLResolveInfo } from "graphql";
import {
  sendFreeChatMessage,
  updateChatSettingsFirestore,
} from "@/services/chat";
export const createGroupChat = (
  _parent: any,
  args: any,
  _context: any,
  _info: any
) => {
  return "demoMutation";
};

export const sendFriendRequest = async (
  _parent: any,
  args: MutationSendFriendRequestArgs,
  _context: any,
  _info: any
): Promise<SendFriendRequestResponse> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw new Error("Your UserID not found");
  }

  const { input } = args;
  const sitrep = await sendFriendRequestFirestore({
    from: userID,
    request: input,
  });
  return {
    status: sitrep.status as unknown as FriendshipStatus,
  };
};

export const manageFriendship = async (
  _parent: any,
  args: MutationManageFriendshipArgs,
  _context: any,
  _info: any
): Promise<ManageFriendshipResponse> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw new Error("Your UserID not found");
  }
  const status = await manageFriendshipFirestore({
    ...args.input,
    userID: userID,
  });
  return {
    status,
  };
};

export const updateChatSettings = async (
  _parent: any,
  args: MutationUpdateChatSettingsArgs,
  _context: any,
  _info: any
): Promise<UpdateChatSettingsResponse> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw new Error("Your UserID not found");
  }

  const chatRoom = await updateChatSettingsFirestore({
    userID: userID,
    input: args.input,
  });

  return {
    chatRoom,
  };
};

export const sendFreeChat = async (
  _parent: any,
  args: MutationSendFreeChatArgs,
  _context: any,
  _info: any
): Promise<SendFreeChatResponse> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw Error("No user ID found");
  }
  const status = await sendFreeChatMessage(args.input, userID);
  return {
    status,
  };
};

export const responses = {
  SendFriendRequestResponse: {
    __resolveType(
      obj: SendFriendRequestResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("status" in obj) {
        return "SendFriendRequestResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
  ManageFriendshipResponse: {
    __resolveType(
      obj: ManageFriendshipResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("status" in obj) {
        return "ManageFriendshipResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
  UpdateChatSettingsResponse: {
    __resolveType(
      obj: UpdateChatSettingsResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("chatRoom" in obj) {
        return "UpdateChatSettingsResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
  SendFreeChatResponse: {
    __resolveType(
      obj: SendFreeChatResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("status" in obj) {
        return "SendFreeChatResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
};
