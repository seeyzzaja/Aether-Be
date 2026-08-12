import "dotenv/config";

export const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 5000,
  HOST: process.env.HOST || "localhost",
  BASE_URL:
    process.env.BASE_URL || `http://${process.env.HOST || "localhost"}:${process.env.PORT || 5000}`,

  DATABASE_URL: process.env.DATABASE_URL || "",
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  WS_PORT: Number(process.env.WS_PORT) || 8080,
  PRESENCE_GRACE_PERIOD_MS: Number(process.env.PRESENCE_GRACE_PERIOD_MS) || 5000,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "aether_super_secret_access_key_12345",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "aether_super_secret_refresh_key_67890",
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  EMAIL_HOST: process.env.EMAIL_HOST || "smtp.gmail.com",
  EMAIL_PORT: Number(process.env.EMAIL_PORT) || 587,
  EMAIL_USER: process.env.EMAIL_USER || "",
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "",
  EMAIL_FROM: process.env.EMAIL_FROM || "",

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
};

export default config;
