import { prisma } from "../../../prisma/client";
import { RecipeService } from "../RecipeService";
import { CreateRecipeDto } from "../dto/CreateRecipeDto";
import { UpdateRecipeDto } from "../dto/UpdateRecipeDto";

jest.mock("../../../prisma/client", () => ({
  prisma: {
    recipe: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

const service = new RecipeService();

describe("RecipeService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("list", () => {
    it("deve chamar prisma.recipe.findMany com include category", async () => {
      (prisma.recipe.findMany as jest.Mock).mockResolvedValue([{ id: 1 }]);
      const result = await service.list(7);

      expect(prisma.recipe.findMany).toHaveBeenCalledWith({
        where: { userId: 7 },
        include: { category: true },
      });
      expect(result).toEqual([{ id: 1 }]);
    });
  });

  describe("getById", () => {
    it("deve chamar prisma.recipe.findFirst com filtros corretos", async () => {
      (prisma.recipe.findFirst as jest.Mock).mockResolvedValue({ id: 2 });
      const result = await service.getById(7, 2);

      expect(prisma.recipe.findFirst).toHaveBeenCalledWith({
        where: { id: 2, userId: 7 },
        include: { category: true },
      });
      expect(result).toEqual({ id: 2 });
    });
  });

  describe("create", () => {
    it("deve criar receita com timestamps", async () => {
      const dto: CreateRecipeDto = {
        name: "Test",
        categoryId: 3,
        preparationTime: 10,
        servings: 2,
        preparationMethod: "Foo",
        ingredients: "Bar",
      };
      (prisma.recipe.create as jest.Mock).mockResolvedValue({ id: 5, ...dto });

      const result = await service.create(4, dto);

      expect(prisma.recipe.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 4,
          ...dto,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      });
      expect(result).toEqual({ id: 5, ...dto });
    });
  });

  describe("update", () => {
    it("deve chamar prisma.recipe.updateMany e retornar mensagem", async () => {
      const dto: UpdateRecipeDto = {
        name: "Up",
        categoryId: 8,
        preparationTime: 20,
        servings: 3,
        preparationMethod: "M",
        ingredients: "I",
      };
      (prisma.recipe.updateMany as jest.Mock).mockResolvedValue({ count: 1 });

      const result = await service.update(9, 6, dto);

      expect(prisma.recipe.updateMany).toHaveBeenCalledWith({
        where: { id: 6, userId: 9 },
        data: expect.objectContaining({ ...dto, updatedAt: expect.any(Date) }),
      });
      expect(result).toEqual({ message: "Recipe updated" });
    });
  });

  describe("delete", () => {
    it("deve chamar prisma.recipe.deleteMany com filtros corretos", async () => {
      (prisma.recipe.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });
      await service.delete(11, 12);

      expect(prisma.recipe.deleteMany).toHaveBeenCalledWith({
        where: { id: 12, userId: 11 },
      });
    });
  });

  describe("search", () => {
    it("sem filtros deve usar apenas userId", async () => {
      (prisma.recipe.findMany as jest.Mock).mockResolvedValue([]);
      await service.search(13);

      expect(prisma.recipe.findMany).toHaveBeenCalledWith({
        where: { userId: 13 },
        include: { category: true },
      });
    });

    it("com query e categoryId deve compor AND corretamente", async () => {
      (prisma.recipe.findMany as jest.Mock).mockResolvedValue([]);
      await service.search(21, "foo", 99);

      expect(prisma.recipe.findMany).toHaveBeenCalledWith({
        where: {
          userId: 21,
          AND: expect.arrayContaining([
            expect.objectContaining({
              OR: expect.any(Array),
            }),
            { categoryId: 99 },
          ]),
        },
        include: { category: true },
      });
    });
  });
});
