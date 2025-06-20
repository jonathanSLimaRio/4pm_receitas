import { Router } from "express";
import { authenticateToken } from "../auth/AuthMiddleware";
import { RecipeService } from "./RecipeService";
import { validate } from "../../middlewares/validate";
import { CreateRecipeSchema, CreateRecipeDto } from "./dto/CreateRecipeDto";
import { UpdateRecipeSchema, UpdateRecipeDto } from "./dto/UpdateRecipeDto";
import { logger } from "../../config/logger";

const router = Router();
const service = new RecipeService();

router.use(authenticateToken);

router.get("/recipes", async (req, res) => {
  const userId = req.user!.id;
  const q = req.query.q?.toString().trim();
  const categoryId = req.query.categoryId
    ? Number(req.query.categoryId)
    : undefined;

  logger.info({ userId, q, categoryId }, "GET /recipes");

  try {
    const result =
      q || categoryId
        ? await service.search(userId, q || "", categoryId)
        : await service.list(userId);

    return res.json(result);
  } catch (err) {
    logger.error({ err, userId, q, categoryId }, "Falha ao listar receitas");
    return res.status(500).json({ error: "Erro interno" });
  }
});

router.get("/recipes/:id", async (req, res) => {
  const userId = req.user!.id;
  const id = Number(req.params.id);

  if (isNaN(id)) {
    logger.warn({ params: req.params }, "ID de receita inválido");
    return res.status(400).json({ error: "ID inválido" });
  }

  logger.info({ userId, id }, "GET /recipes/:id");

  try {
    const recipe = await service.getById(userId, id);
    if (!recipe) {
      logger.info({ userId, id }, "Receita não encontrada");
      return res.status(404).json({ error: "Recipe not found" });
    }
    return res.json(recipe);
  } catch (err) {
    logger.error({ err, userId, id }, "Erro ao buscar receita");
    return res.status(500).json({ error: "Erro interno" });
  }
});

router.post("/recipes", validate(CreateRecipeSchema), async (req, res) => {
  const userId = req.user!.id;
  const dto: CreateRecipeDto = req.body;

  logger.info({ userId, dto }, "POST /recipes");

  try {
    const recipe = await service.create(userId, dto);
    return res.status(201).json(recipe);
  } catch (err) {
    logger.error({ err, userId, dto }, "Erro ao criar receita");
    return res.status(500).json({ error: "Erro interno" });
  }
});

router.put("/recipes/:id", validate(UpdateRecipeSchema), async (req, res) => {
  const userId = req.user!.id;
  const id = Number(req.params.id);
  const dto: UpdateRecipeDto = req.body;

  if (isNaN(id)) {
    logger.warn({ params: req.params }, "ID de receita inválido");
    return res.status(400).json({ error: "ID inválido" });
  }

  logger.info({ userId, id, dto }, "PUT /recipes/:id");

  try {
    const updated = await service.update(userId, id, dto);
    return res.json(updated);
  } catch (err) {
    logger.error({ err, userId, id, dto }, "Erro ao atualizar receita");
    return res.status(500).json({ error: "Erro interno" });
  }
});

router.delete("/recipes/:id", async (req, res) => {
  const userId = req.user!.id;
  const id = Number(req.params.id);

  if (isNaN(id)) {
    logger.warn({ params: req.params }, "ID de receita inválido");
    return res.status(400).json({ error: "ID inválido" });
  }

  logger.info({ userId, id }, "DELETE /recipes/:id");

  try {
    await service.delete(userId, id);
    return res.status(204).send();
  } catch (err) {
    logger.error({ err, userId, id }, "Erro ao deletar receita");
    return res.status(500).json({ error: "Erro interno" });
  }
});

export default router;
