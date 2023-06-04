import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import { createYoga } from "graphql-yoga";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { schema } from "@/services/graphql";

const SERVER_DOMAIN = process.env.SERVER_DOMAIN || "http://localhost";
const SOCKETS_PORT = process.env.SOCKETS_PORT || 8888;

const yoga = createYoga({
  schema,
  graphiql: {
    // Use WebSockets in GraphiQL
    subscriptionsProtocol: "WS",
  },
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

server.listen(SOCKETS_PORT, () => {
  console.log(`Listening on ${SERVER_DOMAIN}:${SOCKETS_PORT}/graphql`);
});
