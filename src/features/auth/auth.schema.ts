import { z } from 'zod';

export const checkUserInputSchema = z.object({
  phone: z.string().regex(/^09\d{9}$/),
});

export const checkUserResponseSchema = z.object({
  exists: z.boolean(),
});

export type TCheckUserInput = z.infer<typeof checkUserInputSchema>;
export type TCheckUserResponse = z.infer<typeof checkUserResponseSchema>;
