import { authGuardHTTP } from "@/graphql/authGuard";
import {
  GetWishResponse,
  GetWishResponseSuccess,
  ListWishlistResponse,
  ListWishlistResponseSuccess,
  QueryListWishlistArgs,
  Wish,
  WishAuthor,
} from "@/graphql/types/resolvers-types";
import { getFirestoreDoc } from "@/services/firestore";
import { sendPushNotification } from "@/services/push";
import { getWishFirestore, listWishlistFirestore } from "@/services/wish";
import {
  FirestoreCollection,
  UserID,
  User_Firestore,
} from "@milkshakechat/helpers";
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

export const getWish = async (
  _parent: any,
  args: any,
  _context: any,
  _info: any
): Promise<GetWishResponseSuccess> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  console.log(`getWish...`);
  if (!userID) {
    throw new Error("No userID found");
  }
  const wish = await getWishFirestore({
    wishID: args.input.wishID,
    requesterUserID: userID,
  });
  return {
    wish,
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
  GetWishResponse: {
    __resolveType(
      obj: GetWishResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("wish" in obj) {
        return "GetWishResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
};

export const CustomWishResolvers = {
  Wish: {
    author: async (parent: Wish): Promise<WishAuthor | null> => {
      const user = await getFirestoreDoc<UserID, User_Firestore>({
        collection: FirestoreCollection.USERS,
        id: parent.creatorID as UserID,
      });
      return {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        displayName: user.displayName,
      };
    },
  },
};
