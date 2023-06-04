import { MutationDemoMutationArgs } from "@/graphql/types/resolvers-types";

export const demoMutation = (
  _parent: any,
  args: MutationDemoMutationArgs,
  _context: any,
  _info: any
) => {
  return {
    id: "id",
    title: args.title,
  };
};
