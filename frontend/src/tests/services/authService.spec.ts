import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { loginUser, registerUser } from "../../services/authService";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("authService", () => {
  const mock = new MockAdapter(axios);
  const baseUrl = "http://localhost:3000";

  afterEach(() => {
    mock.reset();
  });

  it("deve logar o usuário com sucesso", async () => {
    const mockData = { login: "jonathan", password: "123456" };
    const mockResponse = { token: "abc.def.ghi" };

    mock.onPost(`${baseUrl}/login`, mockData).reply(200, mockResponse);

    const response = await loginUser(mockData);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockResponse);
  });

  it("deve falhar ao logar com credenciais erradas", async () => {
    const mockData = { login: "errado", password: "senhaerrada" };
    const mockError = { error: "Usuário não existe ou senha incorreta" };

    mock.onPost(`${baseUrl}/login`, mockData).reply(400, mockError);

    try {
      await loginUser(mockData);
    } catch (err: any) {
      expect(err.response.status).toBe(400);
      expect(err.response.data).toEqual(mockError);
    }
  });

  it("deve registrar um novo usuário", async () => {
    const mockData = { name: "João", login: "joao", password: "senha123" };
    const mockResponse = { message: "Usuário criado com sucesso" };

    mock.onPost(`${baseUrl}/register`, mockData).reply(201, mockResponse);

    const response = await registerUser(mockData);
    expect(response.status).toBe(201);
    expect(response.data).toEqual(mockResponse);
  });
});
