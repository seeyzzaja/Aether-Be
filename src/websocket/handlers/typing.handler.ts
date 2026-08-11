import { typingService } from "#modules/presence/service/typing.service";
import { WebSocketEvent } from "#websocket/constants/events";
import type { TypingPayload } from "#websocket/schemas/typing.schema";
import type { AuthenticatedSocket } from "#websocket/types/socket";

export function handleTypingStart(socket: AuthenticatedSocket, data: TypingPayload): void {
  void typingService.start(data.channelId, socket.user.userId).catch((error) => {
    socket.send(
      JSON.stringify({
        event: WebSocketEvent.ERROR,
        data: {
          message: error instanceof Error ? error.message : "Gagal memproses typing indicator",
        },
      }),
    );
  });
}

export function handleTypingStop(socket: AuthenticatedSocket, data: TypingPayload): void {
  void typingService.stop(data.channelId, socket.user.userId).catch((error) => {
    socket.send(
      JSON.stringify({
        event: WebSocketEvent.ERROR,
        data: {
          message: error instanceof Error ? error.message : "Gagal menghentikan typing indicator",
        },
      }),
    );
  });
}
