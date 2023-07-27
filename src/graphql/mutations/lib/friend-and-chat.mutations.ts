import { authGuardHTTP } from "@/graphql/authGuard";
import {
  AddFriendToChatResponse,
  AdminChatSettingsResponse,
  FriendshipStatus,
  LeaveChatResponse,
  ManageFriendshipResponse,
  MutationAddFriendToChatArgs,
  MutationAdminChatSettingsArgs,
  MutationLeaveChatArgs,
  MutationManageFriendshipArgs,
  MutationPromoteAdminArgs,
  MutationResignAdminArgs,
  MutationSendFreeChatArgs,
  MutationSendFriendRequestArgs,
  MutationUpdateChatSettingsArgs,
  MutationUpgradePremiumChatArgs,
  PromoteAdminResponse,
  ResignAdminResponse,
  SendFreeChatResponse,
  SendFriendRequestResponse,
  UpdateChatSettingsResponse,
  UpgradePremiumChatResponse,
} from "../../types/resolvers-types";
import {
  manageFriendshipFirestore,
  sendFriendRequestFirestore,
} from "@/services/friends";
import { GraphQLResolveInfo } from "graphql";
import {
  addFriendToChatFirestore,
  adminChatSettingsFirestore,
  leaveChatFirestore,
  promoteAdminFirestore,
  resignAdminFirestore,
  sendFreeChatMessage,
  updateChatSettingsFirestore,
  upgradeUsersToPremiumChat,
} from "@/services/chat";
import {
  ChatRoomID,
  ChatRoomParticipantStatus,
  UserID,
} from "@milkshakechat/helpers";

export const createGroupChat = (
  _parent: any,
  args: any,
  _context: any,
  _info: any
) => {
  return "addFriendToChat";
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

export const upgradePremiumChat = async (
  _parent: any,
  args: MutationUpgradePremiumChatArgs,
  _context: any,
  _info: any
): Promise<UpgradePremiumChatResponse> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw Error("No user ID found");
  }
  const referenceIDs = await upgradeUsersToPremiumChat(
    args.input.targets,
    userID,
    args.input.chatRoomID as ChatRoomID
  );
  return {
    referenceIDs,
  };
};

export const adminChatSettings = async (
  _parent: any,
  args: MutationAdminChatSettingsArgs,
  _context: any,
  _info: any
): Promise<AdminChatSettingsResponse> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw Error("No user ID found");
  }
  const chatRoom = await adminChatSettingsFirestore(args.input, userID);
  return {
    chatRoom: {
      chatRoomID: chatRoom.id,
      participants: Object.keys(chatRoom.participants).filter(
        (uid) =>
          chatRoom.participants[uid as UserID] ===
            ChatRoomParticipantStatus.FREE_TIER ||
          chatRoom.participants[uid as UserID] ===
            ChatRoomParticipantStatus.SENDBIRD_ALLOWED
      ),
      admins: chatRoom.admins,
      sendBirdChannelURL: chatRoom.sendBirdChannelURL,
      thumbnail: chatRoom.thumbnail || "",
      title: chatRoom.title || "",
    },
  };
};

export const addFriendToChat = async (
  _parent: any,
  args: MutationAddFriendToChatArgs,
  _context: any,
  _info: any
): Promise<AddFriendToChatResponse> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw Error("No user ID found");
  }
  const status = await addFriendToChatFirestore(args.input, userID);
  return {
    status,
  };
};

export const leaveChat = async (
  _parent: any,
  args: MutationLeaveChatArgs,
  _context: any,
  _info: any
): Promise<LeaveChatResponse> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw Error("No user ID found");
  }
  const status = await leaveChatFirestore(args.input, userID);
  return {
    status,
  };
};

export const resignAdmin = async (
  _parent: any,
  args: MutationResignAdminArgs,
  _context: any,
  _info: any
): Promise<ResignAdminResponse> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw Error("No user ID found");
  }
  const status = await resignAdminFirestore(args.input, userID);
  return {
    status,
  };
};

export const promoteAdmin = async (
  _parent: any,
  args: MutationPromoteAdminArgs,
  _context: any,
  _info: any
): Promise<PromoteAdminResponse> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw Error("No user ID found");
  }
  const status = await promoteAdminFirestore(args.input, userID);
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
  UpgradePremiumChatResponse: {
    __resolveType(
      obj: UpgradePremiumChatResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("referenceIDs" in obj) {
        return "UpgradePremiumChatResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
  AdminChatSettingsResponse: {
    __resolveType(
      obj: UpdateChatSettingsResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("chatRoom" in obj) {
        return "AdminChatSettingsResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
  AddFriendToChatResponse: {
    __resolveType(
      obj: AddFriendToChatResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("status" in obj) {
        return "AddFriendToChatResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
  LeaveChatResponse: {
    __resolveType(
      obj: LeaveChatResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("status" in obj) {
        return "LeaveChatResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
  ResignAdminResponse: {
    __resolveType(
      obj: ResignAdminResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("status" in obj) {
        return "ResignAdminResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
  PromoteAdminResponse: {
    __resolveType(
      obj: PromoteAdminResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("status" in obj) {
        return "PromoteAdminResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
};
