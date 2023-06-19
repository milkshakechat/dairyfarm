import { authGuardHTTP } from "@/graphql/authGuard";
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
  console.log(`viewPublicProfile...`);
  const publicProfile = await getPublicProfile(input.username as Username);
  console.log(`publicProfile`, publicProfile);
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
