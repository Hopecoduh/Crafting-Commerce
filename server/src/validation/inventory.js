import { z } from "zod";

export const gatherSchema = z.object({
  material_id: z.number().int().positive(),
});
