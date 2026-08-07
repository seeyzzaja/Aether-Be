import app from "#app";
import { config } from "#config/env";
import { startWebSocketServer } from "#websocket";

app.listen(config.PORT, "0.0.0.0", () => {
  console.log(`REST API → http://localhost:${config.PORT}`);

  startWebSocketServer(config.WS_PORT);

  console.log(`WebSocket → ws://localhost:${config.WS_PORT}`);
});
