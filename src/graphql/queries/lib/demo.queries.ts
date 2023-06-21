import { authGuardHTTP } from "@/graphql/authGuard";
import {
  DemoQueryResponse,
  DemoQueryResponseSuccess,
  QueryDemoQueryArgs,
} from "@/graphql/types/resolvers-types";
import { sendPushNotification } from "@/services/push";
import { GraphQLResolveInfo } from "graphql";

export const demoQuery = async (
  _parent: any,
  args: QueryDemoQueryArgs,
  _context: any,
  _info: any
): Promise<DemoQueryResponseSuccess> => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
  console.log(`sending push notification...`);
  return {
    message: `Greetings! You said ${args.input.name}. Your userID is ${userID}`,
  };
};

export const responses = {
  DemoQueryResponse: {
    __resolveType(
      obj: DemoQueryResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("message" in obj) {
        return "DemoQueryResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
};
