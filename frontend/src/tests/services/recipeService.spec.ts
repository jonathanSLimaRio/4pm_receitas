import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipeById,
  searchRecipes,
} from "../../services/recipeService";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("recipeService", () => {
  const mock = new MockAdapter(axios);
  const baseUrl = "http://localhost:3000/recipes";

  beforeEach(() => {
    localStorage.setItem("token", "fake-token");
  });

  afterEach(() => {
    mock.reset();
    localStorage.clear();
  });

  it("deve buscar todas as receitas", async () => {
    const mockData = [{ id: 1, name: "Sushi" }];
    mock.onGet(baseUrl).reply(200, mockData);

    const response = await getAllRecipes();
    expect(response).toEqual(mockData);
  });

  it("deve criar uma nova receita", async () => {
    const input = {
      name: "Yakissoba",
      categoryId: 1,
      servings: 2,
      preparationTime: 30,
      preparationMethod: "Fritar os ingredientes",
      ingredients: "Carne, legumes, macarrão",
    };
    const mockData = { id: 10, ...input };

    mock.onPost(baseUrl, input).reply(201, mockData);

    const response = await createRecipe(input);
    expect(response).toEqual(mockData);
  });

  it("deve atualizar uma receita existente", async () => {
    const input = {
      id: 5,
      name: "Sashimi",
      categoryId: 2,
      servings: 1,
      preparationTime: 10,
      preparationMethod: "Cortar o peixe",
      ingredients: "Peixe cru",
    };

    mock.onPut(`${baseUrl}/${input.id}`, input).reply(200, input);

    const response = await updateRecipe(input);
    expect(response).toEqual(input);
  });

  it("deve deletar uma receita pelo ID", async () => {
    const id = 7;
    mock.onDelete(`${baseUrl}/${id}`).reply(204);

    const response = await deleteRecipeById(id);
    expect(response.status).toBe(204);
  });

  it("deve buscar receitas com termo e categoria", async () => {
    const query = "bolo";
    const categoryId = 3;
    const expectedUrl = `${baseUrl}?q=bolo&categoryId=3`;

    const mockData = [
      { id: 99, name: "Bolo de cenoura", categoryId: 3 },
    ];

    mock.onGet(expectedUrl).reply(200, mockData);

    const response = await searchRecipes(query, categoryId);
    expect(response).toEqual(mockData);
  });

  it("deve buscar receitas apenas com termo", async () => {
    const query = "salada";
    const expectedUrl = `${baseUrl}?q=salada`;

    const mockData = [{ id: 2, name: "Salada verde" }];

    mock.onGet(expectedUrl).reply(200, mockData);

    const response = await searchRecipes(query);
    expect(response).toEqual(mockData);
  });
});
