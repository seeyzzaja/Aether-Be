import type { WebSocketServer } from "ws";

import {
  decrementPresenceConnections,
  incrementPresenceConnections,
} from "#modules/presence/repository/presence.repository";
import {
  cancelPresenceOffline,
  schedulePresenceOffline,
} from "#modules/presence/service/presence.grace-period";
import { updatePresence } from "#modules/presence/service/presence.service";
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

    const userId = authSocket.user.userId;

    connectionRegistry.addUserSocket(authSocket);

    const connections = await incrementPresenceConnections(userId);

    cancelPresenceOffline(userId);

    if (connections === 1) {
      await updatePresence(userId, "online");
    }

    console.log(` ${authSocket.user.username} connected`);
    console.log("[PRESENCE] Global connections:", connections);

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

    let presenceConnectionReleased = false;

    authSocket.on("close", async () => {
      if (presenceConnectionReleased) {
        console.log("[PRESENCE] Duplicate close ignored:", userId);
        return;
      }

      presenceConnectionReleased = true;

      console.log("[PRESENCE] WebSocket close:", userId);

      connectionRegistry.removeSocket(authSocket);

      const connections = await decrementPresenceConnections(userId);

      console.log("[PRESENCE] Global connections:", connections);

      if (connections === 0) {
        console.log("[PRESENCE] Scheduling offline:", userId);

        schedulePresenceOffline(userId);
      }

      connectionRegistry.dump();

      console.log(` ${authSocket.user.username} disconnected`);
    });

    authSocket.on("error", (error) => {
      console.error(error);
    });
  });
}
