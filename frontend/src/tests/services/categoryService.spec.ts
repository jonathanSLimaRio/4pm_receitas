import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("categoryService", () => {
  const mock = new MockAdapter(axios);
  const baseUrl = "http://localhost:3000/categories";

  beforeEach(() => {
    localStorage.setItem("token", "fake-token");
  });

  afterEach(() => {
    mock.reset();
    localStorage.clear();
  });

  it("deve buscar todas as categorias", async () => {
    const mockData = [{ id: 1, name: "Japonesa" }];
    mock.onGet(baseUrl).reply(200, mockData);

    const response = await getAllCategories();
    expect(response).toEqual(mockData);
  });

  it("deve buscar uma categoria pelo ID", async () => {
    const id = 1;
    const mockData = { id, name: "Italiana" };

    mock.onGet(`${baseUrl}/${id}`).reply(200, mockData);

    const response = await getCategoryById(id);
    expect(response).toEqual(mockData);
  });

  it("deve criar uma nova categoria", async () => {
    const input = { name: "Mexicana" };
    const mockData = { id: 2, ...input };

    mock.onPost(baseUrl, input).reply(201, mockData);

    const response = await createCategory(input);
    expect(response).toEqual(mockData);
  });

  it("deve atualizar uma categoria", async () => {
    const id = 3;
    const input = { name: "Árabe" };
    const mockData = { id, ...input };

    mock.onPut(`${baseUrl}/${id}`, input).reply(200, mockData);

    const response = await updateCategory(id, input);
    expect(response).toEqual(mockData);
  });

  it("deve deletar uma categoria", async () => {
    const id = 4;

    mock.onDelete(`${baseUrl}/${id}`).reply(204);

    const response = await deleteCategory(id);
    expect(response.status).toBe(204);
  });
});
