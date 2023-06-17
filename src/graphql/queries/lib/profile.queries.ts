import { authGuardHTTP } from "@/graphql/authGuard";
import {
  CheckUsernameAvailableResponse,
  GetMyProfileResponse,
  QueryCheckUsernameAvailableArgs,
} from "@/graphql/types/resolvers-types";
import { getFirestoreDoc } from "@/services/firestore";
import { checkIfUsernameAvailable } from "@/utils/username";
import {
  FirestoreCollection,
  UserID,
  User_Firestore,
  checkIfUsernameIsAllowed,
} from "@milkshakechat/helpers";
import { GraphQLResolveInfo } from "graphql";

export const getMyProfile = async (
  _parent: any,
  args: any,
  _context: any,
  _info: any
) => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw new Error("No userID found");
  }
  try {
    const user = await getFirestoreDoc<UserID, User_Firestore>({
      id: userID,
      collection: FirestoreCollection.USERS,
    });

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

export const checkUsernameAvailable = async (
  _parent: any,
  args: QueryCheckUsernameAvailableArgs,
  _context: any,
  _info: any
) => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  const isAvail = await checkIfUsernameAvailable(args.input.username);
  const isAllowed = checkIfUsernameIsAllowed(args.input.username);
  return {
    isAvailable: isAvail && isAllowed,
  };
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
  CheckUsernameAvailableResponse: {
    __resolveType(
      obj: CheckUsernameAvailableResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("isAvailable" in obj) {
        return "CheckUsernameAvailableResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
};
