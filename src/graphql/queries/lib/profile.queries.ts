import { authGuard } from "@/graphql/authGuard";
import { GetMyProfileResponse } from "@/graphql/types/resolvers-types";
import { GraphQLResolveInfo } from "graphql";

export const getMyProfile = async (
  _parent: any,
  args: any,
  _context: any,
  _info: any
) => {
  // const { userID } = await authGuard({ _context, enforceAuth: true });
  return {
    message: `Greetings! You said ${args.input}. Your userID is ${"userID"}`,
  };
};

export const responses = {
  GetMyProfileResponse: {
    __resolveType(
      obj: GetMyProfileResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("message" in obj) {
        return "GetMyProfileResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
};
