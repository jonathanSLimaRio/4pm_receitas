import express from "express";
import request from "supertest";

jest.mock("../../auth/AuthMiddleware", () => ({
  authenticateToken: (req: any, _res: any, next: any) => {
    req.user = { id: 42 };
    next();
  },
}));
jest.mock("../../../middlewares/validate", () => ({
  validate: () => (_req: any, _res: any, next: any) => next(),
}));

const mockService = {
  list: jest.fn(),
  search: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
jest.doMock("../RecipeService", () => ({
  RecipeService: jest.fn(() => mockService),
}));

import recipeRouter from "../RecipeController";

describe("RecipeController", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(recipeRouter);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /recipes", () => {
    it("200 → lista simples sem query", async () => {
      mockService.list.mockResolvedValue([
        { id: 1, name: "A", category: { id: 2, name: "C" } },
      ]);
      const res = await request(app).get("/recipes");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        { id: 1, name: "A", category: { id: 2, name: "C" } },
      ]);
      expect(mockService.list).toHaveBeenCalledWith(42);
    });

    it("200 → busca por q", async () => {
      mockService.search.mockResolvedValue([
        { id: 3, name: "Foo", category: { id: 4, name: "Bar" } },
      ]);
      const res = await request(app).get("/recipes?q=foo");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        { id: 3, name: "Foo", category: { id: 4, name: "Bar" } },
      ]);
      expect(mockService.search).toHaveBeenCalledWith(42, "foo", undefined);
    });

    it("200 → busca por categoryId", async () => {
      mockService.search.mockResolvedValue([]);
      const res = await request(app).get("/recipes?categoryId=5");

      expect(res.status).toBe(200);
      expect(mockService.search).toHaveBeenCalledWith(42, "", 5);
    });

    it("500 → erro interno list", async () => {
      mockService.list.mockRejectedValue(new Error());
      const res = await request(app).get("/recipes");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Erro interno" });
    });
  });

  describe("GET /recipes/:id", () => {
    it("400 → id inválido", async () => {
      const res = await request(app).get("/recipes/abc");
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "ID inválido" });
    });

    it("404 → não encontrado", async () => {
      mockService.getById.mockResolvedValue(null);
      const res = await request(app).get("/recipes/7");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Recipe not found" });
    });

    it("200 → retorna receita", async () => {
      mockService.getById.mockResolvedValue({
        id: 7,
        name: "R",
        category: { id: 1, name: "X" },
      });
      const res = await request(app).get("/recipes/7");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        id: 7,
        name: "R",
        category: { id: 1, name: "X" },
      });
    });

    it("500 → erro ao buscar", async () => {
      mockService.getById.mockRejectedValue(new Error());
      const res = await request(app).get("/recipes/9");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Erro interno" });
    });
  });

  describe("POST /recipes", () => {
    const payload = {
      name: "Nova",
      categoryId: 2,
      preparationTime: 15,
      servings: 4,
      preparationMethod: "M",
      ingredients: "I",
    };

    it("201 → cria receita", async () => {
      mockService.create.mockResolvedValue({ id: 8, ...payload });
      const res = await request(app).post("/recipes").send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ id: 8, ...payload });
      expect(mockService.create).toHaveBeenCalledWith(42, payload);
    });

    it("500 → falha ao criar", async () => {
      mockService.create.mockRejectedValue(new Error());
      const res = await request(app).post("/recipes").send(payload);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Erro interno" });
    });
  });

  describe("PUT /recipes/:id", () => {
    const payload = { name: "Upd" };

    it("400 → id inválido", async () => {
      const res = await request(app).put("/recipes/xx").send(payload);
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "ID inválido" });
    });

    it("200 → atualiza receita", async () => {
      mockService.update.mockResolvedValue({ message: "Recipe updated" });
      const res = await request(app).put("/recipes/5").send(payload);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Recipe updated" });
      expect(mockService.update).toHaveBeenCalledWith(42, 5, payload);
    });

    it("500 → falha ao atualizar", async () => {
      mockService.update.mockRejectedValue(new Error());
      const res = await request(app).put("/recipes/5").send(payload);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Erro interno" });
    });
  });

  describe("DELETE /recipes/:id", () => {
    it("400 → id inválido", async () => {
      const res = await request(app).delete("/recipes/zz");
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "ID inválido" });
    });

    it("204 → exclui receita", async () => {
      mockService.delete.mockResolvedValue(undefined);
      const res = await request(app).delete("/recipes/6");

      expect(res.status).toBe(204);
      expect(mockService.delete).toHaveBeenCalledWith(42, 6);
    });

    it("500 → falha ao deletar", async () => {
      mockService.delete.mockRejectedValue(new Error());
      const res = await request(app).delete("/recipes/6");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Erro interno" });
    });
  });
});
