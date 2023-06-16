import { authGuardHTTP } from "@/graphql/authGuard";
import {
  ModifyProfileResponse,
  MutationDemoMutationArgs,
  MutationModifyProfileArgs,
} from "@/graphql/types/resolvers-types";
import { updateFirestoreDoc } from "@/services/firestore";
import { FirestoreCollection } from "@milkshakechat/helpers";
import { GraphQLResolveInfo } from "graphql";

export const modifyProfile = async (
  _parent: any,
  args: MutationModifyProfileArgs,
  _context: any,
  _info: any
) => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  if (!userID) {
    throw Error("No user ID found");
  }
  const user = await updateFirestoreDoc({
    id: userID,
    payload: args.input,
    collection: FirestoreCollection.USERS,
  });
  return {
    user,
  };
};

export const responses = {
  ModifyProfileResponse: {
    __resolveType(
      obj: ModifyProfileResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("user" in obj) {
        return "ModifyProfileResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
};
