import { prisma } from "@/prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RegisterDto } from "./dto/RegisterDto";
import { LoginDto } from "./dto/LoginDto";

export class AuthService {
  async register(data: RegisterDto) {
    const { name, login, password } = data;

    const existing = await prisma.user.findUnique({ where: { login } });
    if (existing) throw new Error("Login already in use");

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        login,
        password: hashed,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return user;
  }

  async login(data: LoginDto) {
    const { login, password } = data;

    const user = await prisma.user.findUnique({ where: { login } });
    if (!user) throw new Error("Invalid login");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid password");

    const token = jwt.sign({ userId: user.id }, "secret", { expiresIn: "1h" });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        login: user.login,
      },
    };
  }
}
