import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";
import { readFileSync } from "node:fs";
import { createYoga, createSchema } from "graphql-yoga";
import {
  MutationCreateStoryArgs,
  QueryGreetingsArgs,
  Resolvers,
} from "@/graphql/types/resolvers-types";

const typeDefs = readFileSync("src/graphql/schema.graphql", "utf8");

const resolvers: Resolvers = {
  Query: {
    // typed resolvers
    greetings: (_parent: any, args: QueryGreetingsArgs, _context, _info: any) =>
      `Greetings! You said ${args.input}`,
  },
  Mutation: {
    // typed resolvers
    createStory: (
      _parent: any,
      args: MutationCreateStoryArgs,
      _context,
      _info: any
    ) => {
      return {
        id: "id",
        title: args.title,
      };
    },
  },
  Subscription: {
    announcements: {
      subscribe: async function* () {
        for (const hi of ["Hi", "Bonjour", "Hola", "Ciao", "Zdravo"]) {
          yield { message: hi };
        }
      },
      resolve: (payload: any) => {
        // Perform any additional logic you want on the payload here
        console.log("got payload", payload);
        return payload;
      },
    },
  },
};

export const schema = createSchema({ typeDefs, resolvers });
