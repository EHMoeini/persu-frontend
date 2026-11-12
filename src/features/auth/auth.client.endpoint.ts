'use client';

import { EXTERNAL_ENDPOINTS } from '@/constants/endpoints.constant';
import { httpClient } from '@/utils/http/http-client';

import type {
    IAuthResponse,
    ICheckResponse,
    ISessionResponse,
    ISuccessResponse,
    ITokenPair,
} from './auth.models';
import { AUTH_COUNTRY_CODE, toWirePhone, type NationalPhone } from './auth.phone';
import {
    loginWithPasswordInputSchema,
    loginWithPasswordResponseSchema,
    registerInputSchema,
    registerResponseSchema,
    sendOtpInputSchema,
    sendOtpResponseSchema,
    sessionResponseSchema,
    tokenPairSchema,
    userCheckInputSchema,
    userCheckResponseSchema,
    verifyOtpInputSchema,
    verifyOtpResponseSchema,
    type TLoginWithPasswordInput,
    type TRegisterInput,
    type TSendOtpInput,
    type TVerifyOtpInput,
} from './auth.schema';

const AUTH_OPTIONS = { skipErrorRedirect: true } as const;
const API_ORIGIN = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');

function authUrl(path: string): string {
    return `${API_ORIGIN}${path}`;
}

/** POST /auth/check — whether an account exists for this phone number. */
export async function checkUser(phone: NationalPhone): Promise<ICheckResponse> {
    const data = userCheckInputSchema.parse({ phone });
    const response = await httpClient.post<unknown>(
        authUrl(EXTERNAL_ENDPOINTS.AUTH_CHECK),
        { countryCode: AUTH_COUNTRY_CODE, phone: toWirePhone(data.phone) },
        undefined,
        AUTH_OPTIONS,
    );

    return userCheckResponseSchema.parse(response);
}

/** POST /auth/register — creates an account and returns a session. */
export async function registerAccount(input: TRegisterInput): Promise<IAuthResponse> {
    const data = registerInputSchema.parse(input);
    const response = await httpClient.post<unknown>(
        authUrl(EXTERNAL_ENDPOINTS.AUTH_REGISTER),
        {
            countryCode: AUTH_COUNTRY_CODE,
            phone: toWirePhone(data.phone),
            password: data.password,
            fullName: data.fullName,
        },
        undefined,
        AUTH_OPTIONS,
    );

    return registerResponseSchema.parse(response);
}

/** POST /auth/login — authenticates a phone number with its password. */
export async function loginWithPassword(input: TLoginWithPasswordInput): Promise<IAuthResponse> {
    const data = loginWithPasswordInputSchema.parse(input);
    const response = await httpClient.post<unknown>(
        authUrl(EXTERNAL_ENDPOINTS.AUTH_LOGIN),
        {
            countryCode: AUTH_COUNTRY_CODE,
            phone: toWirePhone(data.phone),
            password: data.password,
        },
        undefined,
        AUTH_OPTIONS,
    );

    return loginWithPasswordResponseSchema.parse(response);
}

/** POST /auth/otp/send — (re)sends the OTP for this phone number. */
export async function sendOtp(input: TSendOtpInput): Promise<ISuccessResponse> {
    const data = sendOtpInputSchema.parse(input);
    const response = await httpClient.post<unknown>(
        authUrl(EXTERNAL_ENDPOINTS.AUTH_OTP_SEND),
        { countryCode: AUTH_COUNTRY_CODE, phone: toWirePhone(data.phone) },
        undefined,
        AUTH_OPTIONS,
    );

    return sendOtpResponseSchema.parse(response);
}

/** POST /auth/otp/verify — verifies the code and returns a session. */
export async function verifyOtp(input: TVerifyOtpInput): Promise<IAuthResponse> {
    const data = verifyOtpInputSchema.parse(input);
    const response = await httpClient.post<unknown>(
        authUrl(EXTERNAL_ENDPOINTS.AUTH_OTP_VERIFY),
        {
            countryCode: AUTH_COUNTRY_CODE,
            phone: toWirePhone(data.phone),
            code: data.code,
        },
        undefined,
        AUTH_OPTIONS,
    );

    return verifyOtpResponseSchema.parse(response);
}

/** POST /auth/refresh — rotates a refresh token. */
export async function refreshSession(refreshToken: string): Promise<ITokenPair> {
    const response = await httpClient.post<unknown>(
        authUrl(EXTERNAL_ENDPOINTS.AUTH_REFRESH),
        { refreshToken },
        undefined,
        AUTH_OPTIONS,
    );

    return tokenPairSchema.parse(response);
}

/** POST /auth/logout — revokes the refresh-token family. */
export async function logout(refreshToken: string): Promise<void> {
    await httpClient.post<null>(
        authUrl(EXTERNAL_ENDPOINTS.AUTH_LOGOUT),
        { refreshToken },
        undefined,
        AUTH_OPTIONS,
    );
}

/** GET /auth/session — current user for the Bearer access token. */
export async function getSession(): Promise<ISessionResponse> {
    const response = await httpClient.get<unknown>(
        authUrl(EXTERNAL_ENDPOINTS.AUTH_SESSION),
        undefined,
        { auth: true, skipErrorRedirect: true },
    );

    return sessionResponseSchema.parse(response);
}
