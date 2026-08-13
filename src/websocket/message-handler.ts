import type WebSocket from "ws";
import { ZodError } from "zod";
import { WebSocketEvent } from "#websocket/constants/events";
import {
  handlePing,
  handleSubscribe,
  handleTypingStart,
  handleTypingStop,
  handleUnsubscribe,
} from "#websocket/handlers/index";
import type { WebSocketMessage } from "#websocket/types/message";
import type { AuthenticatedSocket } from "#websocket/types/socket";

import {
  validateSubscribe,
  validateTyping,
  validateUnsubscribe,
} from "#websocket/validators/index";

export function handleMessage(socket: WebSocket, rawMessage: string): void {
  let message: WebSocketMessage;

  try {
    message = JSON.parse(rawMessage);
  } catch {
    socket.send(
      JSON.stringify({
        event: "error",
        data: {
          message: "Invalid JSON",
        },
      }),
    );

    return;
  }

  try {
    switch (message.event) {
      case WebSocketEvent.PING:
        handlePing(socket, message);
        break;

      case WebSocketEvent.SUBSCRIBE: {
        const data = validateSubscribe(message.data);

        handleSubscribe(socket as AuthenticatedSocket, {
          event: message.event,
          data,
        });
        break;
      }

      case WebSocketEvent.UNSUBSCRIBE: {
        const data = validateUnsubscribe(message.data);

        handleUnsubscribe(socket as AuthenticatedSocket, {
          event: message.event,
          data,
        });
        break;
      }
      case WebSocketEvent.TYPING_START: {
        const data = validateTyping(message.data);

        handleTypingStart(socket as AuthenticatedSocket, data);
        break;
      }

      case WebSocketEvent.TYPING_STOP: {
        const data = validateTyping(message.data);

        handleTypingStop(socket as AuthenticatedSocket, data);
        break;
      }

      default:
        socket.send(
          JSON.stringify({
            event: WebSocketEvent.ERROR,
            data: {
              message: `Unknown event: ${message.event}`,
            },
          }),
        );
        break;
    }
  } catch (error) {
    if (error instanceof ZodError) {
      socket.send(
        JSON.stringify({
          event: WebSocketEvent.ERROR,
          data: {
            message: "Invalid payload",
            errors: error.flatten(),
          },
        }),
      );

      return;
    }

    throw error;
  }
}
