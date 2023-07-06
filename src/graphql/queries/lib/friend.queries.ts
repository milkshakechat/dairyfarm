import { authGuardHTTP, getUserIDFromAuthToken } from "@/graphql/authGuard";
import {
  DemoQueryResponse,
  QueryDemoQueryArgs,
  QueryViewPublicProfileArgs,
  ViewPublicProfileResponse,
} from "@/graphql/types/resolvers-types";
import { getPublicProfile } from "@/services/friends";
import { sendPushNotification } from "@/services/push";
import { Username } from "@milkshakechat/helpers";
import { GraphQLResolveInfo } from "graphql";

export const viewPublicProfile = async (
  _parent: any,
  { input }: QueryViewPublicProfileArgs,
  _context: any,
  _info: any
) => {
  const selfUserID = await getUserIDFromAuthToken({ _context });
  console.log(`selfUserID`, selfUserID);
  const publicProfile = await getPublicProfile({
    username: input.username as Username,
    userID: input.userID,
    requesterID: selfUserID,
  });
  return publicProfile;
};

export const responses = {
  ViewPublicProfileResponse: {
    __resolveType(
      obj: ViewPublicProfileResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("id" in obj) {
        return "ViewPublicProfileResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
};
