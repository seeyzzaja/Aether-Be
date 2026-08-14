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
import { logger } from "#shared/logger/logger";
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

    logger.info({ userId: authSocket.user.userId }, "WebSocket client connected");
    logger.debug({ connections }, "Global presence connections");

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
        logger.debug({ userId }, "Duplicate WebSocket close ignored");
        return;
      }

      presenceConnectionReleased = true;

      logger.debug({ userId }, "WebSocket connection closed");

      connectionRegistry.removeSocket(authSocket);

      const connections = await decrementPresenceConnections(userId);

      logger.debug({ connections }, "Global presence connections");

      if (connections === 0) {
        logger.debug({ userId }, "Scheduling presence offline");

        schedulePresenceOffline(userId);
      }

      connectionRegistry.dump();

      logger.info({ userId: authSocket.user.userId }, "WebSocket client disconnected");
    });

    authSocket.on("error", (error) => {
      logger.error({ err: error }, "WebSocket error");
    });
  });
}
