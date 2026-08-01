import swaggerJsdoc from "swagger-jsdoc";
import { config } from "#config/env";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Aether API Documentation",
      version: "1.0.0",
      description: "Dokumentasi lengkap API Aether (Discord-Like Web Application)",
      contact: {
        name: "Backend Developer",
      },
    },
    servers: [
      {
        url: `${config.BASE_URL}`,
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["src/**/*.ts", "src/**/*.js", "./dist/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
