import { readFileSync, readdirSync } from "node:fs";
import { createSchema } from "graphql-yoga";
import { Resolvers } from "@/graphql/types/resolvers-types";
import * as QueryResolvers from "@/graphql/queries";
import * as QueryResponses from "@/graphql/queries/responses";
import * as MutationResolvers from "@/graphql/mutations";
import * as SubscriptionResolvers from "@/graphql/subscriptions";

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
  ...Object.assign({}, ...Object.values(QueryResponses)),
};

export const schema = createSchema({ typeDefs, resolvers });
