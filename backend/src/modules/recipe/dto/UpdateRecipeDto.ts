import { z } from "zod";

export const UpdateRecipeSchema = z.object({
  name: z.string().optional(),
  categoryId: z.number().optional(),
  preparationTime: z.number().optional(),
  servings: z.number().optional(),
  preparationMethod: z.string().optional(),
  ingredients: z.string().optional(),
});

export type UpdateRecipeDto = z.infer<typeof UpdateRecipeSchema>;
