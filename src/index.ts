import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import { createYoga, Plugin } from "graphql-yoga";
import { useDisableIntrospection } from "@graphql-yoga/plugin-disable-introspection";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { schema } from "@/graphql";
import { initializeApp } from "firebase-admin/app";
import { getFirebaseConfig } from "@/utils/secrets";

const SOCKETS_PORT = process.env.PORT || 8080;

const yogaPlugins = [];
if (process.env.NODE_ENV !== "development") {
  yogaPlugins.push(useDisableIntrospection());
}

const yoga = createYoga({
  schema,
  graphiql: {
    // Use WebSockets in GraphiQL
    subscriptionsProtocol: "WS",
  },
  plugins: yogaPlugins,
});

// Get NodeJS Server from Yoga
const server = createServer(yoga);

// Create WebSocket server instance from our Node server
const wsServer = new WebSocketServer({
  server,
  path: yoga.graphqlEndpoint,
});

// Integrate through Yoga's Envelop instance
useServer(
  {
    execute: (args: any) => args.rootValue.execute(args),
    subscribe: (args: any) => args.rootValue.subscribe(args),
    onSubscribe: async (ctx, msg) => {
      console.log(
        `A new GraphQL operation received on subscription channel...`
      );
      const { schema, execute, subscribe, contextFactory, parse, validate } =
        yoga.getEnveloped({
          ...ctx,
          req: ctx.extra.request,
          socket: ctx.extra.socket,
          params: msg.payload,
        });

      const args = {
        schema,
        operationName: msg.payload.operationName,
        document: parse(msg.payload.query),
        variableValues: msg.payload.variables,
        contextValue: await contextFactory(),
        rootValue: {
          execute,
          subscribe,
        },
      };

      const errors = validate(args.schema, args.document);
      if (errors.length) return errors;
      return args;
    },
  },
  wsServer
);

const initFirebase = async () => {
  const firebaseConfig = await getFirebaseConfig();
  // load firebase app credentials using secretmanager
  // https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments
  initializeApp(firebaseConfig);
};
initFirebase();

server.listen(SOCKETS_PORT, () => {
  console.log(`Listening on PORT ${SOCKETS_PORT}/graphql`);
});
