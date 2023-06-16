import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import { createYoga, Plugin } from "graphql-yoga";
import { useDisableIntrospection } from "@graphql-yoga/plugin-disable-introspection";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { schema } from "@/graphql";
import { initFirebase } from "@/services/firebase";
import config from "@/config.env";

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
  cors: {
    origin: config.GRAPHQL.CORS_ORIGINS,
    methods: ["GET", "POST", "OPTIONS"],
  },
});

// Get NodeJS Server from Yoga
const server = createServer(yoga);

// Create WebSocket server instance from our Node server
const wsServer = new WebSocketServer({
  server,
  path: yoga.graphqlEndpoint,
});

// Variable to hold the number of active connections
let activeConnections = 0;

wsServer.on("connection", function connection(ws) {
  activeConnections++; // increment the active connections
  console.log("Number of active connections: " + activeConnections);

  ws.on("close", function close() {
    activeConnections--; // decrement the active connections
    console.log("Number of active connections: " + activeConnections);
  });
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

initFirebase();

server.listen(SOCKETS_PORT, () => {
  console.log(`Listening on PORT ${SOCKETS_PORT}/graphql`);
});
