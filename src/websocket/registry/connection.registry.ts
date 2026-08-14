import { logger } from "#shared/logger/logger";
import type { AuthenticatedSocket } from "#websocket/types/socket";

export class ConnectionRegistry {
  private readonly channels = new Map<string, Set<AuthenticatedSocket>>();
  private readonly users = new Map<string, Set<AuthenticatedSocket>>();

  subscribe(channelId: string, socket: AuthenticatedSocket): void {
    let sockets = this.channels.get(channelId);

    if (!sockets) {
      sockets = new Set();
      this.channels.set(channelId, sockets);
    }

    sockets.add(socket);
  }

  unsubscribe(channelId: string, socket: AuthenticatedSocket): void {
    const sockets = this.channels.get(channelId);

    if (!sockets) {
      return;
    }

    sockets.delete(socket);

    if (sockets.size === 0) {
      this.channels.delete(channelId);
    }
  }

  getConnections(channelId: string): ReadonlySet<AuthenticatedSocket> {
    return this.channels.get(channelId) ?? new Set();
  }

  addUserSocket(socket: AuthenticatedSocket): void {
    const userId = socket.user.userId;

    let sockets = this.users.get(userId);

    if (!sockets) {
      sockets = new Set();
      this.users.set(userId, sockets);
    }

    sockets.add(socket);
  }

  removeUserSocket(socket: AuthenticatedSocket): void {
    const userId = socket.user.userId;
    const sockets = this.users.get(userId);

    if (!sockets) {
      return;
    }

    sockets.delete(socket);

    if (sockets.size === 0) {
      this.users.delete(userId);
    }
  }

  getUserConnections(userId: string): ReadonlySet<AuthenticatedSocket> {
    return this.users.get(userId) ?? new Set();
  }

  hasUserConnections(userId: string): boolean {
    return this.users.has(userId);
  }

  removeSocket(socket: AuthenticatedSocket): void {
    for (const [channelId, sockets] of this.channels) {
      sockets.delete(socket);

      if (sockets.size === 0) {
        this.channels.delete(channelId);
      }
    }

    this.removeUserSocket(socket);
  }

  public dump(): void {
    const channelConnections = Object.fromEntries(
      Array.from(this.channels.entries()).map(([channelId, sockets]) => [channelId, sockets.size]),
    );

    const userConnections = Object.fromEntries(
      Array.from(this.users.entries()).map(([userId, sockets]) => [userId, sockets.size]),
    );

    logger.debug(
      {
        channelConnections,
        userConnections,
      },
      "Connection registry state",
    );
  }
}
