import type { AuthenticatedSocket } from "#websocket/types/socket.js";

export class ConnectionRegistry {
  private readonly channels = new Map<string, Set<AuthenticatedSocket>>();

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

  removeSocket(socket: AuthenticatedSocket): void {
    for (const [channelId, sockets] of this.channels) {
      sockets.delete(socket);

      if (sockets.size === 0) {
        this.channels.delete(channelId);
      }
    }
  }

  // 👇 Tambahkan di sini
  public dump(): void {
    console.log("===== Connection Registry =====");

    for (const [channelId, sockets] of this.channels) {
      console.log(`${channelId}: ${sockets.size} socket(s)`);
    }

    console.log("===============================");
  }
}
