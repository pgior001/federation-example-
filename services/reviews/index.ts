import express from "express";
import cors from "cors";
import { server } from "./server";
import { createServer } from "node:http";
import { expressMiddleware } from "@apollo/server/express4";
import { WebSocketServer } from "ws";
import bodyParser from "body-parser";

server.start().then(() => {
  const app = express();
  const httpServer = createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

	wsServer.on("connection", () => {
		console.log("Client connected for subscriptions");
	});

  app.use(
    "/graphql",
    cors(),
    bodyParser.json(),
    expressMiddleware(server)
  );

  httpServer.listen(4004, () => {
    console.log(`🚀 Server ready at http://localhost:4004/graphql`);
  });
});
