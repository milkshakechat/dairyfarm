import { authGuardHTTP } from "@/graphql/authGuard";
import {
  DemoQueryResponse,
  QueryDemoQueryArgs,
} from "@/graphql/types/resolvers-types";
import { GraphQLResolveInfo } from "graphql";

export const demoQuery = async (
  _parent: any,
  args: QueryDemoQueryArgs,
  _context: any,
  _info: any
) => {
  const { userID } = await authGuardHTTP({ _context, enforceAuth: true });
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
