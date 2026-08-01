import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "#config/swagger";
import swaggerUiOptions from "#config/swagger-ui-theme";
import { errorHandlerMiddleware } from "#middlewares/error-handler";
import authRouter from "#modules/auth/route/auth.routes";
import { NotFoundError } from "#shared/errors/app-error";
import { successResponse } from "#utils/response";

const app = express();

app.use((req: Request, _res: Response, next: NextFunction) => {
  req.startTime = Date.now();
  next();
});

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com", "fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "validator.swagger.io"],
      },
    },
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Swagger Documentation Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Root route
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

// API v1 routes
app.use("/api/v1/auth", authRouter);

// 404 Route Not Found
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError(`Route ${req.originalUrl} tidak ditemukan`));
});

// Global Error Handler
app.use(errorHandlerMiddleware);

export default app;
