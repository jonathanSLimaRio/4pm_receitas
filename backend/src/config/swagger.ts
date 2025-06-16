import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Recipe API",
    version: "1.0.0",
    description: "API documentation for Recipe App",
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      RegisterUser: {
        type: "object",
        properties: {
          name: { type: "string" },
          login: { type: "string" },
          password: { type: "string" },
        },
        required: ["login", "password"],
      },
      LoginUser: {
        type: "object",
        properties: {
          login: { type: "string" },
          password: { type: "string" },
        },
        required: ["login", "password"],
      },
      Recipe: {
        type: "object",
        properties: {
          name: { type: "string" },
          categoryId: { type: "integer" },
          preparationTime: { type: "integer" },
          servings: { type: "integer" },
          preparationMethod: { type: "string" },
          ingredients: { type: "string" },
        },
        required: [
          "name",
          "categoryId",
          "preparationTime",
          "servings",
          "preparationMethod",
          "ingredients",
        ],
      },
      Category: {
        type: "object",
        properties: {
          name: { type: "string" },
        },
        required: ["name"],
      },
    },
  },
  paths: {
    "/register": {
      post: {
        tags: ["Auth"],
        summary: "Register new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterUser" },
            },
          },
        },
        responses: {
          "201": { description: "User created" },
          "400": { description: "User already exists or validation failed" },
        },
      },
    },
    "/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginUser" },
            },
          },
        },
        responses: {
          "200": { description: "Login successful" },
          "400": { description: "Invalid credentials" },
        },
      },
    },
    "/logout": {
      post: {
        tags: ["Auth"],
        summary: "Log out user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Logoff simulated (token required)" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/recipes": {
      get: {
        tags: ["Recipe"],
        summary: "List user's recipes",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Recipe list" },
        },
      },
      post: {
        tags: ["Recipe"],
        summary: "Create recipe",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Recipe" },
            },
          },
        },
        responses: {
          "201": { description: "Recipe created" },
          "400": { description: "Validation failed" },
        },
      },
    },
    "/recipes/{id}": {
      get: {
        tags: ["Recipe"],
        summary: "Get single recipe",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Recipe details" },
          "404": { description: "Not found" },
        },
      },
      put: {
        tags: ["Recipe"],
        summary: "Update recipe",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Recipe" },
            },
          },
        },
        responses: {
          "200": { description: "Updated" },
          "400": { description: "Validation failed" },
        },
      },
      delete: {
        tags: ["Recipe"],
        summary: "Delete recipe",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        security: [{ bearerAuth: [] }],
        responses: {
          "204": { description: "Deleted" },
        },
      },
    },
    "/categories": {
      get: {
        tags: ["Category"],
        summary: "List all categories",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "List of categories" },
        },
      },
      post: {
        tags: ["Category"],
        summary: "Create a category",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Category" },
            },
          },
        },
        responses: {
          "201": { description: "Category created" },
        },
      },
    },
    "/categories/{id}": {
      get: {
        tags: ["Category"],
        summary: "Get category by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Category found" },
          "404": { description: "Not found" },
        },
      },
      put: {
        tags: ["Category"],
        summary: "Update category",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Category" },
            },
          },
        },
        responses: {
          "200": { description: "Category updated" },
        },
      },
      delete: {
        tags: ["Category"],
        summary: "Delete category",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        security: [{ bearerAuth: [] }],
        responses: {
          "204": { description: "Category deleted" },
        },
      },
    },
  },
};

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
