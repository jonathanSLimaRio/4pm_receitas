import { Router } from "express";
import { AuthService } from "./AuthService";
import { authenticateToken } from "../auth/AuthMiddleware";
import { RegisterDto } from "./dto/RegisterDto";
import { LoginDto } from "./dto/LoginDto";

const router = Router();
const service = new AuthService();

router.post("/register", async (req, res) => {
  try {
    const user = await service.register(req.body as RegisterDto);
    res.status(201).json(user);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const result = await service.login(req.body as LoginDto);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/logout", authenticateToken, (req, res) => {
  res
    .status(200)
    .json({ message: `User ${req.user?.id} logged out (token discard)` });
});

export default router;
