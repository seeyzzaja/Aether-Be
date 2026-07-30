import "dotenv/config";

export const config = {
  NODE_ENV: process.env.NODE_ENV || "development",

  PORT: Number(process.env.PORT) || 5000,

  HOST: process.env.HOST || "localhost",

  DATABASE_URL: process.env.DATABASE_URL || "",
};