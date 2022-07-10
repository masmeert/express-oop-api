import z from "zod";

export const userPostModel = z.object({
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

export const userPutModel = userPostModel.partial();

export const accountPostModel = z.object({
  providerId: z.string().nullish(),
  password: z.string().nullish(),
  lastPassword: z.string().nullish(),
  userId: z.string(),
  providerName: z.string(),
});

export const accountPutModel = accountPostModel.partial();
