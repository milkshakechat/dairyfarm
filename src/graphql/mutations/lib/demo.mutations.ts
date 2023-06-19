import {
  DemoMutationResponse,
  MutationDemoMutationArgs,
} from "@/graphql/types/resolvers-types";
import { GraphQLResolveInfo } from "graphql";

export const demoMutation = async (
  _parent: any,
  args: MutationDemoMutationArgs,
  _context: any,
  _info: any
): Promise<DemoMutationResponse> => {
  return {
    item: {
      id: "id",
      title: args.input.name,
    },
  };
};

export const responses = {
  DemoMutationResponse: {
    __resolveType(
      obj: DemoMutationResponse,
      context: any,
      info: GraphQLResolveInfo
    ) {
      if ("item" in obj) {
        return "DemoMutationResponseSuccess";
      }
      if ("error" in obj) {
        return "ResponseError";
      }
      return null; // GraphQLError is thrown here
    },
  },
};
