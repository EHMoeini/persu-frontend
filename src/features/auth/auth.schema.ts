import { z } from 'zod';

export const userCheckInputSchema = z.object({
    phone: z.string().regex(/^09\d{9}$/),
});

export const userCheckResponseSchema = z.object({
    exists: z.boolean(),
});

export const registerInputSchema = z.object({
    phone: z.string().regex(/^09\d{9}$/),
    fullName: z.string().trim().min(1),
    password: z.string().min(8),
});

export const registerResponseSchema = z.object({
    registered: z.boolean(),
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

export type TUserCheckInput = z.infer<typeof userCheckInputSchema>;
export type TUserCheckResponse = z.infer<typeof userCheckResponseSchema>;
export type TRegisterInput = z.infer<typeof registerInputSchema>;
export type TRegisterResponse = z.infer<typeof registerResponseSchema>;
export type TVerifyOtpInput = z.infer<typeof verifyOtpInputSchema>;
export type TVerifyOtpResponse = z.infer<typeof verifyOtpResponseSchema>;
export type TSendOtpInput = z.infer<typeof sendOtpInputSchema>;
export type TSendOtpResponse = z.infer<typeof sendOtpResponseSchema>;
export type TLoginWithPasswordInput = z.infer<typeof loginWithPasswordInputSchema>;
export type TLoginWithPasswordResponse = z.infer<typeof loginWithPasswordResponseSchema>;
