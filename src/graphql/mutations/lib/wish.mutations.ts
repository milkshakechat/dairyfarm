import { authGuardHTTP } from "@/graphql/authGuard";
import {
  CreateWishResponse,
  MutationCreateWishArgs,
  MutationUpdateWishArgs,
  UpdateWishResponse,
} from "@/graphql/types/resolvers-types";
import { createWishFirestore, updateWishFirestore } from "@/services/wish";
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

export const updateWish = async (
  _parent: any,
  args: MutationUpdateWishArgs,
  _context: any,
  _info: any
): Promise<UpdateWishResponse> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw Error("No user ID found");
  }
  const wish = await updateWishFirestore(args.input, userID);
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
  UpdateWishResponse: {
    __resolveType(
      obj: UpdateWishResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("wish" in obj) {
        return "UpdateWishResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
};
