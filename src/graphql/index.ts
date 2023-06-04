import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";
import { readFileSync } from "node:fs";
import { createSchema } from "graphql-yoga";
import { Resolvers } from "@/graphql/types/resolvers-types";
import QueryResolvers from "@/graphql/query";
import MutationResolvers from "@/graphql/mutation";
import SubscriptionResolvers from "@/graphql/subscription";

const typeDefs = readFileSync("src/graphql/schema.graphql", "utf8");

const resolvers: Resolvers = {
  Query: QueryResolvers,
  Mutation: MutationResolvers,
  Subscription: SubscriptionResolvers,
};

export const schema = createSchema({ typeDefs, resolvers });
