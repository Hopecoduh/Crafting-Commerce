import { z } from "zod";

export const craftSchema = z.object({
  recipe_id: z.number().int().positive(),
});
