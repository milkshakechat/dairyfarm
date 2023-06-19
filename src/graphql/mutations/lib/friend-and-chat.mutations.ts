import { authGuardHTTP } from "@/graphql/authGuard";
import {
  FriendshipStatus,
  ManageFriendshipResponse,
  MutationManageFriendshipArgs,
  MutationSendFriendRequestArgs,
  SendFriendRequestResponse,
} from "../../types/resolvers-types";
import {
  manageFriendshipFirestore,
  sendFriendRequestFirestore,
} from "@/services/friends";
import { GraphQLResolveInfo } from "graphql";
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
  console.log(`Init mutation - sendFriendRequest...`);
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw new Error("Your UserID not found");
  }
  console.log(`Passed auth check`);
  const { input } = args;
  const sitrep = await sendFriendRequestFirestore({
    from: userID,
    request: input,
  });
  console.log(`Got the sitrep`);
  console.log(sitrep);
  console.log(sitrep.status);
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

export const responses = {
  SendFriendRequestResponse: {
    __resolveType(
      obj: SendFriendRequestResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      console.log(`checker,.....`);
      console.log(obj);
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
};
