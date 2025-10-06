import express, { Router as router } from "express";
import {
  createGatewayRuntime,
} from "@graphql-hive/gateway-runtime";
import { createServer } from "node:http";
import { useServer } from "graphql-ws/use/ws";
import { WebSocketServer } from "ws";

export const gatewayRuntime = createGatewayRuntime({
  transports: {
    http: import("@graphql-mesh/transport-http"),
    ws: import("@graphql-mesh/transport-ws"),
  },
  supergraph: "./supergraph.graphql",
  transportEntries: {
    "*": {
      options: {
        subscriptions: {
          kind: "ws",
          options: {
            connectionParams: {
              authorization: "{context.connectionParams.Authorization}", // SSE
            },
          },
        },
      },
    },
  },
});

const expressApp = express();

const hiveGatewayRouter = router();
hiveGatewayRouter.use(gatewayRuntime);
expressApp.use(gatewayRuntime.graphqlEndpoint, hiveGatewayRouter);

const server = createServer(expressApp);

const websocketServer = new WebSocketServer({
  server,
  path: "/graphql",
});

useServer(
  {
    schema: async () => gatewayRuntime.getSchema(),
    // This is where the error is happening, if we remove this context function, subscriptions work
    context(context) {
      console.log(context);
      return context;
    },
  },
  websocketServer
);

// Start the server
server.listen(4000, () => {
  console.log(`Server is running on http://localhost:4000`);
});
