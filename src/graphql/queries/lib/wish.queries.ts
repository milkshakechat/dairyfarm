import { authGuardHTTP } from "@/graphql/authGuard";
import {
  ListWishlistResponse,
  ListWishlistResponseSuccess,
  QueryListWishlistArgs,
} from "@/graphql/types/resolvers-types";
import { sendPushNotification } from "@/services/push";
import { listWishlistFirestore } from "@/services/wish";
import { GraphQLResolveInfo } from "graphql";

export const listWishlist = async (
  _parent: any,
  args: QueryListWishlistArgs,
  _context: any,
  _info: any
): Promise<ListWishlistResponseSuccess> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  console.log(`listWishlist...`);
  if (!userID) {
    throw new Error("No userID found");
  }
  const wishlist = await listWishlistFirestore({
    targetUserID: args.input.userID,
    requesterUserID: userID,
  });
  return {
    wishlist,
  };
};

export const responses = {
  ListWishlistResponse: {
    __resolveType(
      obj: ListWishlistResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("wishlist" in obj) {
        return "ListWishlistResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
};
