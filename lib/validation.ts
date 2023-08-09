import * as z from "zod";

export const ProductSchema = z.object({
  name: z.string().min(2, {
    message: "label must be at least 2 characters.",
  }),
  image: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  sizeId: z.string().min(1),
  colorId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

export type ProductType = z.infer<typeof ProductSchema>;
