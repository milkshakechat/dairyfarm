import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "src/graphql/**/**.graphql",
  generates: {
    "src/graphql/types/resolvers-types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
};
export default config;
