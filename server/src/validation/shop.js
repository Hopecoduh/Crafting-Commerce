import { z } from "zod";

export const listItemSchema = z.object({
  item_id: z.number().int().positive(),
  price: z.number().int().positive(),
  quantity: z.number().int().positive(),
});
