import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { config } from "#config/env";
import swaggerSpec from "#config/swagger";
import swaggerUiOptions from "#config/swagger-ui-theme";
import { errorHandlerMiddleware } from "#middlewares/error-handler";
import { apiRateLimiter } from "#middlewares/rate-limiters";
import adminRouter from "#modules/admin/route/admin.route";
import authRouter from "#modules/auth/route/auth.route";
import categoryRouter from "#modules/category/route/category.route";
import channelRouter from "#modules/channel/route/channel.routes";
import conversationRouter from "#modules/conversation/route/conversation.route";
import deviceRouter from "#modules/device/route/device.route";
import friendRouter from "#modules/friend/route/friend.route";
import membershipRouter from "#modules/membership/route/membership.route";
import messageRouter from "#modules/message/route/message.route";
import notificationRouter from "#modules/notification/route/notification.route";
import pollRouter from "#modules/pool/route/poll.route";
import reactionRouter from "#modules/reaction/route/reaction.route";
import readReceiptRouter from "#modules/read-receipt/route/read-receipt.route";
import roleRouter from "#modules/role/route/role.route";
import searchRouter from "#modules/search/route/search.route";
import serverRouter from "#modules/server/route/server.routes";
import uploadRouter from "#modules/upload/route/upload.route";
import userRouter from "#modules/user/route/user.route";
import voiceRouter from "#modules/voice/route/voice.route";
import { NotFoundError } from "#shared/errors/app-error";
import { successResponse } from "#utils/response";

const app = express();
const allowedOrigins = new Set(
  [config.BASE_URL, ...config.CORS_ORIGINS.split(",").map((origin) => origin.trim())].filter(
    Boolean,
  ),
);

app.use((req: Request, _res: Response, next: NextFunction) => {
  req.startTime = Date.now();
  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS origin tidak diizinkan: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "https://res.cloudinary.com", "data:"],
        mediaSrc: ["'self'", "https://res.cloudinary.com"],
        connectSrc: ["'self'", "wss://*.example.com", "https://*.livekit.example.com"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
      },
    },
    frameguard: {
      action: "deny",
    },
    referrerPolicy: {
      policy: "strict-origin-when-cross-origin",
    },
    hsts: {
      maxAge: 63072000,
      includeSubDomains: true,
    },
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

app.get("/", (req: Request, res: Response) => {
  const processTime = Date.now() - (req.startTime ?? Date.now());
  successResponse(
    res,
    "Selamat datang di Aether API Service",
    {
      status: "Server hidup!",
      waktu_proses: `${processTime} ms`,
      docs: "/api-docs",
    },
    null,
    200,
  );
});
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Aether API is healthy",
  });
});
app.use("/api", apiRateLimiter);
app.use("/api/auth", authRouter);
app.use("/api/device", deviceRouter);
app.use("/api/servers", serverRouter);
app.use("/api/membership", membershipRouter);
app.use("/api/channel", channelRouter);
app.use("/api/category", categoryRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/role", roleRouter);
app.use("/api/message", messageRouter);
app.use("/api/message", reactionRouter);
app.use("/api/read-receipt", readReceiptRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/search", searchRouter);
app.use("/api/channels", voiceRouter);
app.use("/api", pollRouter);
app.use("/api/admin", adminRouter);
app.use("/api/friends", friendRouter);
app.use("/api/users", userRouter);
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError(`Route ${req.originalUrl} tidak ditemukan`));
});

app.use(errorHandlerMiddleware);

export default app;
