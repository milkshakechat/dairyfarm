import { authGuardHTTP } from "@/graphql/authGuard";
import {
  CheckUsernameAvailableResponse,
  GetMyProfileResponse,
  QueryCheckUsernameAvailableArgs,
} from "@/graphql/types/resolvers-types";
import { getFirestoreDoc, listFirestoreDocs } from "@/services/firestore";
import { checkIfUsernameAvailable } from "@/utils/username";
import {
  FirestoreCollection,
  Friendship_Firestore,
  UserID,
  User_Firestore,
  checkIfUsernameIsAllowed,
} from "@milkshakechat/helpers";
import { GraphQLResolveInfo } from "graphql";
import { ListContactsResponse } from "../../types/resolvers-types";

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

export const listContacts = async (
  _parent: any,
  args: any,
  _context: any,
  _info: any
) => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw new Error("No userID found");
  }
  console.log(`userID = ${userID}`);
  // get friendships
  const friendships = await listFirestoreDocs<Friendship_Firestore>({
    where: {
      field: "primaryUserID",
      operator: "==",
      value: userID,
    },
    collection: FirestoreCollection.FRIENDSHIPS,
  });
  console.log(`${friendships.length} friendships found ---`);
  const contacts = await Promise.all(
    friendships.map(async (fr) => {
      console.log(`-------`);
      console.log(fr);
      try {
        const user = await getFirestoreDoc<UserID, User_Firestore>({
          id: fr.friendID,
          collection: FirestoreCollection.USERS,
        });
        console.log(user);
        return {
          friendID: fr.friendID,
          username: user.username,
          displayName: fr.friendNickname || user.displayName,
          avatar: user.avatar,
          status: fr.status,
        };
      } catch (e) {
        return {
          friendID: fr.friendID,
          username: fr.friendID,
          displayName: fr.friendNickname || fr.friendID,
          status: fr.status,
        };
      }
    })
  );
  const allUsers = await listFirestoreDocs<User_Firestore>({
    where: {
      field: "disabled",
      operator: "==",
      value: false,
    },
    collection: FirestoreCollection.USERS,
  });
  const globalDirectory = allUsers.map((u) => {
    return {
      friendID: u.id,
      username: u.username,
      displayName: u.displayName,
      avatar: u.avatar,
    };
  });
  return {
    contacts,
    globalDirectory,
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
  ListContactsResponse: {
    __resolveType(
      obj: ListContactsResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("contacts" in obj) {
        return "ListContactsResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
};
