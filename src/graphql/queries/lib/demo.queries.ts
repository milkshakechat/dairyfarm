import { authGuard } from "@/graphql/authGuard";
import { QueryDemoQueryArgs } from "@/graphql/types/resolvers-types";

export const demoQuery = async (
  _parent: any,
  args: QueryDemoQueryArgs,
  _context: any,
  _info: any
) => {
  const { userID } = await authGuard({ _context, enforceAuth: true });
  return `Greetings! You said ${args.input}. Your userID is ${userID}`;
};
