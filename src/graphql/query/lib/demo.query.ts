import { QueryDemoQueryArgs } from "@/graphql/types/resolvers-types";

export const demoQuery = (
  _parent: any,
  args: QueryDemoQueryArgs,
  _context: any,
  _info: any
) => {
  console.log(`Resolver for demoQuery`);
  return `Greetings! You said ${args.input}`;
};
