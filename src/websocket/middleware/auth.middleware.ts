import type { IncomingMessage } from "node:http";

import { verifyAccessToken } from "#shared/auth/access-token.service.js";
import type { AuthenticatedSocket } from "#websocket/types/socket.js";

export async function authenticateSocket(
  socket: AuthenticatedSocket,
  request: IncomingMessage,
): Promise<boolean> {
  try {
    const url = new URL(request.url ?? "", "http://localhost");

    const token = url.searchParams.get("token");

    if (!token) {
      socket.close(1008, "Authentication required");
      return false;
    }

    const payload = await verifyAccessToken(token);

    socket.user = payload;

    return true;
  } catch {
    socket.close(1008, "Invalid token");
    return false;
  }
}
