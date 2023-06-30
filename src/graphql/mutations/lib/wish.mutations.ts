import { authGuardHTTP } from "@/graphql/authGuard";
import {
  CreateWishResponse,
  MutationCreateWishArgs,
} from "@/graphql/types/resolvers-types";
import { createWishFirestore } from "@/services/wish";
import { GraphQLResolveInfo } from "graphql";

export const createWish = async (
  _parent: any,
  args: MutationCreateWishArgs,
  _context: any,
  _info: any
): Promise<CreateWishResponse> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw Error("No user ID found");
  }
  const wish = await createWishFirestore(args.input, userID);
  return {
    wish,
  };
};

export const responses = {
  CreateWishResponse: {
    __resolveType(
      obj: CreateWishResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("wish" in obj) {
        return "CreateWishResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
};
