import { z } from "zod";

export const CreateRecipeSchema = z.object({
  name: z.string().min(1),
  categoryId: z.number(),
  preparationTime: z.number().min(1),
  servings: z.number().min(1),
  preparationMethod: z.string().min(1),
  ingredients: z.string().min(1),
});

export type CreateRecipeDto = z.infer<typeof CreateRecipeSchema>;
