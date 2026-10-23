import { z } from 'zod';

export const checkUserInputSchema = z.object({
  phone: z.string().regex(/^09\d{9}$/),
});

export const checkUserResponseSchema = z.object({
  exists: z.boolean(),
});

export const verifyOtpInputSchema = z.object({
  phone: z.string().regex(/^09\d{9}$/),
  code: z.string().regex(/^\d{4}$/),
});

export const verifyOtpResponseSchema = z.object({
  verified: z.boolean(),
});

export const sendOtpInputSchema = z.object({
  phone: z.string().regex(/^09\d{9}$/),
});

export const sendOtpResponseSchema = z.object({
  sent: z.boolean(),
});

export const loginWithPasswordInputSchema = z.object({
  phone: z.string().regex(/^09\d{9}$/),
  password: z.string().min(1),
});

export const loginWithPasswordResponseSchema = z.object({
  authenticated: z.boolean(),
});

export type TCheckUserInput = z.infer<typeof checkUserInputSchema>;
export type TCheckUserResponse = z.infer<typeof checkUserResponseSchema>;
export type TVerifyOtpInput = z.infer<typeof verifyOtpInputSchema>;
export type TVerifyOtpResponse = z.infer<typeof verifyOtpResponseSchema>;
export type TSendOtpInput = z.infer<typeof sendOtpInputSchema>;
export type TSendOtpResponse = z.infer<typeof sendOtpResponseSchema>;
export type TLoginWithPasswordInput = z.infer<typeof loginWithPasswordInputSchema>;
export type TLoginWithPasswordResponse = z.infer<typeof loginWithPasswordResponseSchema>;
