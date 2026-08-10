import type { WebSocketServer } from "ws";
import { handleMessage } from "#websocket/message-handler";
import { authenticateSocket } from "#websocket/middleware/auth.middleware";
import { connectionRegistry } from "#websocket/registry/index";
import type { AuthenticatedSocket } from "#websocket/types/socket";

export function registerGateway(wss: WebSocketServer): void {
  wss.on("connection", async (socket, request) => {
    const authSocket = socket as AuthenticatedSocket;

    const authenticated = await authenticateSocket(authSocket, request);

    if (!authenticated) {
      return;
    }

    console.log(` ${authSocket.user.username} connected`);

    authSocket.send(
      JSON.stringify({
        event: "connected",
        data: {
          message: "Welcome to Aether",
        },
      }),
    );

    authSocket.on("message", (data) => {
      handleMessage(authSocket, data.toString());
    });

    authSocket.on("close", () => {
      connectionRegistry.removeSocket(authSocket);
      connectionRegistry.dump();
      console.log(` ${authSocket.user.username} disconnected`);
    });

    authSocket.on("error", (error) => {
      console.error(error);
    });
  });
}
