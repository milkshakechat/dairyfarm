import { authGuard } from "@/graphql/authGuard";
import { GetMyProfileResponse } from "@/graphql/types/resolvers-types";
import { getFirestoreDoc } from "@/services/firestore";
import {
  FirestoreCollection,
  UserID,
  User_Firestore,
} from "@milkshakechat/helpers";
import { GraphQLResolveInfo } from "graphql";

export const getMyProfile = async (
  _parent: any,
  args: any,
  _context: any,
  _info: any
) => {
  const { userID } = await authGuard({ _context, enforceAuth: true });
  if (!userID) {
    throw new Error("No userID found");
  }
  try {
    const user = await getFirestoreDoc<UserID, User_Firestore>({
      id: userID,
      collection: FirestoreCollection.USERS,
    });
    console.log(user);
    return {
      user: {
        ...user,
        createdAt: (user.createdAt as any).toDate(),
      },
    };
  } catch (e) {
    console.log(e);
    throw new Error("Failed to get user profile");
  }
};

export const responses = {
  GetMyProfileResponse: {
    __resolveType(
      obj: GetMyProfileResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("user" in obj) {
        return "GetMyProfileResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
};
