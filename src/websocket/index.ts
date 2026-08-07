import { registerGateway } from "./gateway.js";
import { createWebSocketServer } from "./server.js";

export function startWebSocketServer(port: number) {
  const wss = createWebSocketServer(port);

  registerGateway(wss);

  return wss;
}
