import z from "zod";

export const winePostModel = z.object({
  name: z.string().min(2, "Name is too short."),
  origin: z.string().min(2, "Origin is too short."),
  price: z.number().min(0, "Price is too low."),
  description: z.string().min(2, "Description is too short."),
});

export const winePutModel = winePostModel.partial();
