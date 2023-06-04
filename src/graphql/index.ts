import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";
import { readFileSync, readdirSync } from "node:fs";
import { createSchema } from "graphql-yoga";
import { Resolvers } from "@/graphql/types/resolvers-types";
import QueryResolvers from "@/graphql/query";
import MutationResolvers from "@/graphql/mutation";
import SubscriptionResolvers from "@/graphql/subscription";

// const typeDefs = readFileSync("src/graphql/schema.graphql", "utf8");
// Define the directory where the .graphql files are
const schemaDir = "src/graphql/schemas";
// Read the directory and filter out non-.graphql files
const schemaFiles = readdirSync(schemaDir).filter((file) =>
  file.endsWith(".graphql")
);
// Read each .graphql file and combine them into one string
const typeDefs = schemaFiles
  .map((file) => readFileSync(`${schemaDir}/${file}`, "utf8"))
  .join("\n");

const resolvers: Resolvers = {
  Query: QueryResolvers,
  Mutation: MutationResolvers,
  Subscription: SubscriptionResolvers,
};

export const schema = createSchema({ typeDefs, resolvers });
