import { Router } from "express";
import { CategoryService } from "./CategoryService";
import { authenticateToken } from "../auth/AuthMiddleware";
import { CreateCategoryDto } from "./dto/CreateCategoryDto";
import { UpdateCategoryDto } from "./dto/UpdateCategoryDto";

const router = Router();
const service = new CategoryService();

router.use(authenticateToken);

router.get("/categories", async (req, res) => {
  const categories = await service.list();
  res.json(categories);
});

router.get("/categories/:id", async (req, res) => {
  const category = await service.getById(+req.params.id);
  if (!category) return res.status(404).json({ error: "Not found" });
  res.json(category);
});

router.post("/categories", async (req, res) => {
  const dto = req.body as CreateCategoryDto;
  const category = await service.create(dto);
  res.status(201).json(category);
});

router.put("/categories/:id", async (req, res) => {
  const dto = req.body as UpdateCategoryDto;
  const category = await service.update(+req.params.id, dto);
  res.json(category);
});

router.delete("/categories/:id", async (req, res) => {
  await service.delete(+req.params.id);
  res.status(204).send();
});

export default router;
