import "dotenv/config";

export const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 5000,
  HOST: process.env.HOST || "localhost",
  BASE_URL:
    process.env.BASE_URL || `http://${process.env.HOST || "localhost"}:${process.env.PORT || 5000}`,
  DATABASE_URL: process.env.DATABASE_URL || "",
  WS_PORT: Number(process.env.WS_PORT) || 8080,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "aether_super_secret_access_key_12345",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "aether_super_secret_refresh_key_67890",
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
};

export default config;
