import WebSocket from "ws";

const ws = new WebSocket("ws://ws.localhost");

ws.on("open", () => {
  console.log("CONNECTED");
});

ws.on("message", (data) => {
  console.log("MESSAGE:", data.toString());
});

ws.on("close", (code, reason) => {
  console.log("CLOSED:", code, reason.toString());
});

ws.on("error", (err) => {
  console.error("ERROR:", err.message);
});
