import { z } from 'zod';

import type {
    IAuthResponse,
    ICheckResponse,
    ISessionResponse,
    ISuccessResponse,
    ITokenPair,
    IUser,
} from './auth.models';
import type { NationalPhone } from './auth.phone';

/**
 * Canonical phone the endpoints accept: national 10 digits without the trunk
 * `0`. Endpoints serialize it to the trunk-`0` wire form via `toWirePhone`.
 */
const nationalPhoneSchema = z
    .string()
    .regex(/^9\d{9}$/)
    .transform((value) => value as NationalPhone);

const passwordSchema = (minLength: number) =>
    z
        .string()
        .min(minLength)
        .max(128)
        .refine((value) => value.trim().length > 0);

const fullNameSchema = z.string().trim().min(1).max(64);

const userSchema: z.ZodType<IUser> = z.object({
    id: z.string(),
    phone: z.string(),
    nickName: z.string().optional(),
    avatar: z.string().optional(),
});

export const userCheckInputSchema = z.object({
    phone: nationalPhoneSchema,
});

export const userCheckResponseSchema: z.ZodType<ICheckResponse> = z.object({
    exists: z.boolean(),
});

export const registerInputSchema = z.object({
    phone: nationalPhoneSchema,
    fullName: fullNameSchema,
    password: passwordSchema(8),
});

export const registerResponseSchema: z.ZodType<IAuthResponse> = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    user: userSchema,
});

export const verifyOtpInputSchema = z.object({
    phone: nationalPhoneSchema,
    code: z.string().regex(/^\d{6}$/),
});

export const verifyOtpResponseSchema: z.ZodType<IAuthResponse> = registerResponseSchema;

export const sendOtpInputSchema = z.object({
    phone: nationalPhoneSchema,
});

export const sendOtpResponseSchema: z.ZodType<ISuccessResponse> = z.object({
    success: z.boolean(),
});

export const loginWithPasswordInputSchema = z.object({
    phone: nationalPhoneSchema,
    password: passwordSchema(1),
});

export const loginWithPasswordResponseSchema: z.ZodType<IAuthResponse> = registerResponseSchema;

export const sessionResponseSchema: z.ZodType<ISessionResponse> = z.object({
    user: userSchema,
});

export const tokenPairSchema: z.ZodType<ITokenPair> = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
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
