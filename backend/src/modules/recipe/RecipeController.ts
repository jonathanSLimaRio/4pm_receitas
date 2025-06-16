import { Router } from "express";
import { authenticateToken } from "../auth/AuthMiddleware";
import { RecipeService } from "./RecipeService";
import { CreateRecipeDto } from "./dto/CreateRecipeDto";
import { UpdateRecipeDto } from "./dto/UpdateRecipeDto";

const router = Router();
const service = new RecipeService();

router.use(authenticateToken);

router.get("/recipes", async (req, res) => {
  const recipes = await service.list(req.user!.id);
  res.json(recipes);
});

router.get("/recipes/:id", async (req, res) => {
  const recipe = await service.getById(req.user!.id, +req.params.id);
  if (!recipe) return res.status(404).json({ error: "Recipe not found" });
  res.json(recipe);
});

router.post("/recipes", async (req, res) => {
  const dto = req.body as CreateRecipeDto;
  const recipe = await service.create(req.user!.id, dto);
  res.status(201).json(recipe);
});

router.put("/recipes/:id", async (req, res) => {
  const dto = req.body as UpdateRecipeDto;
  const updated = await service.update(req.user!.id, +req.params.id, dto);
  res.json(updated);
});

router.delete("/recipes/:id", async (req, res) => {
  await service.delete(req.user!.id, +req.params.id);
  res.status(204).send();
});

export default router;
