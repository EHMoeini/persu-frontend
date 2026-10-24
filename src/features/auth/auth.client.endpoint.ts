'use client';

import { API_ENDPOINTS, API_USE_MOCK } from '@/constants/api.constant';
import { httpBaseUrlClient } from '@/utils/http/http-client';

import {
    mockUserCheck,
    mockLoginWithPassword,
    mockRegister,
    mockSendOtp,
    mockVerifyOtp,
} from './auth.mock';
import {
    userCheckResponseSchema,
    loginWithPasswordResponseSchema,
    registerResponseSchema,
    sendOtpResponseSchema,
    verifyOtpResponseSchema,
    type TUserCheckResponse,
    type TLoginWithPasswordInput,
    type TLoginWithPasswordResponse,
    type TRegisterInput,
    type TRegisterResponse,
    type TSendOtpInput,
    type TSendOtpResponse,
    type TVerifyOtpInput,
    type TVerifyOtpResponse,
} from './auth.schema';

/**
 * POST /auth/user-check — whether an account exists for this phone number.
 * Served by the local mock while `NEXT_PUBLIC_API_USE_MOCK` is on.
 */
export async function userCheck(phone: string): Promise<TUserCheckResponse> {
    if (API_USE_MOCK) {
        return mockUserCheck(phone);
    }

    const response = await httpBaseUrlClient.post<unknown>(
        API_ENDPOINTS.auth.userCheck,
        { phone },
        undefined,
        { skipErrorRedirect: true },
    );

    return userCheckResponseSchema.parse(response);
}

/** POST /auth/register — creates an account for a phone number. */
export async function registerAccount(input: TRegisterInput): Promise<TRegisterResponse> {
    if (API_USE_MOCK) {
        return mockRegister(input.phone, input.password);
    }

    const response = await httpBaseUrlClient.post<unknown>(
        API_ENDPOINTS.auth.register,
        input,
        undefined,
        { skipErrorRedirect: true },
    );

    return registerResponseSchema.parse(response);
}

/** POST /auth/otp/verify — whether the OTP is correct for this phone number. */
export async function verifyOtp(input: TVerifyOtpInput): Promise<TVerifyOtpResponse> {
    if (API_USE_MOCK) {
        return mockVerifyOtp(input.code);
    }

    const response = await httpBaseUrlClient.post<unknown>(
        API_ENDPOINTS.auth.verifyOtp,
        input,
        undefined,
        { skipErrorRedirect: true },
    );

    return verifyOtpResponseSchema.parse(response);
}

/** POST /auth/otp/send — (re)sends the OTP for this phone number. */
export async function sendOtp(input: TSendOtpInput): Promise<TSendOtpResponse> {
    if (API_USE_MOCK) {
        return mockSendOtp();
    }

    const response = await httpBaseUrlClient.post<unknown>(
        API_ENDPOINTS.auth.sendOtp,
        input,
        undefined,
        { skipErrorRedirect: true },
    );

    return sendOtpResponseSchema.parse(response);
}

/** POST /auth/password/login — whether the password matches this phone number. */
export async function loginWithPassword(
    input: TLoginWithPasswordInput,
): Promise<TLoginWithPasswordResponse> {
    if (API_USE_MOCK) {
        return mockLoginWithPassword(input.phone, input.password);
    }

    const response = await httpBaseUrlClient.post<unknown>(
        API_ENDPOINTS.auth.loginWithPassword,
        input,
        undefined,
        { skipErrorRedirect: true },
    );

    return loginWithPasswordResponseSchema.parse(response);
}
