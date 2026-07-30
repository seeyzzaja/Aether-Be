import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import helmet from "helmet";
import { successResponse } from "#utils/response";

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(express.urlencoded({ extended: true }));



app.get("/", (req: Request, res: Response) => {
  const processTime = Date.now() - (req.startTime ?? Date.now());
  successResponse(
    res,
    "Selamat datang",
    {
      status: "Server hidup!",
      waktu_proses: `${processTime} ms`,
    },
    null,
    200
  );
});


app.use(express.static("./"));

app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new Error(`Route ${req.originalUrl} tidak ditemukan`));
});

export default app