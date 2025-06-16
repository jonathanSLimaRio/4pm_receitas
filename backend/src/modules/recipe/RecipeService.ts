import { prisma } from "@/prisma/client";
import { CreateRecipeDto } from "./dto/CreateRecipeDto";
import { UpdateRecipeDto } from "./dto/UpdateRecipeDto";

export class RecipeService {
  async list(userId: number) {
    return prisma.recipe.findMany({
      where: { userId },
      include: { category: true },
    });
  }

  async getById(userId: number, id: number) {
    return prisma.recipe.findFirst({
      where: { id, userId },
      include: { category: true },
    });
  }

  async create(userId: number, data: CreateRecipeDto) {
    return prisma.recipe.create({
      data: {
        userId,
        categoryId: data.categoryId,
        name: data.name,
        preparationTime: data.preparationTime,
        servings: data.servings,
        preparationMethod: data.preparationMethod,
        ingredients: data.ingredients,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async update(userId: number, id: number, data: UpdateRecipeDto) {
    await prisma.recipe.updateMany({
      where: { id, userId },
      data: {
        categoryId: data.categoryId,
        name: data.name,
        preparationTime: data.preparationTime,
        servings: data.servings,
        preparationMethod: data.preparationMethod,
        ingredients: data.ingredients,
        updatedAt: new Date(),
      },
    });

    return { message: "Recipe updated" };
  }

  async delete(userId: number, id: number) {
    await prisma.recipe.deleteMany({
      where: { id, userId },
    });
  }
}
