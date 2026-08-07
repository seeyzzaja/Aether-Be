import { WebSocketServer } from "ws";

export function createWebSocketServer(port: number) {
  const wss = new WebSocketServer({
    port,
  });

  return wss;
}
