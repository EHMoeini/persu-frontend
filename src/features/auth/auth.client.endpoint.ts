'use client';

import { API_ENDPOINTS, API_USE_MOCK } from '@/constants/api.constant';
import { httpBaseUrlClient } from '@/utils/http/http-client';

import { toWirePhone, type NationalPhone } from './auth.phone';
import {
    mockUserCheck,
    mockLoginWithPassword,
    mockRegister,
    mockSendOtp,
    mockVerifyOtp,
} from './auth.mock';
import {
    loginWithPasswordInputSchema,
    userCheckInputSchema,
    userCheckResponseSchema,
    loginWithPasswordResponseSchema,
    registerInputSchema,
    registerResponseSchema,
    sendOtpInputSchema,
    sendOtpResponseSchema,
    verifyOtpInputSchema,
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
export async function userCheck(phone: NationalPhone): Promise<TUserCheckResponse> {
    const wire = toWirePhone(userCheckInputSchema.parse({ phone }).phone);

    if (API_USE_MOCK) {
        return mockUserCheck(wire);
    }

    const response = await httpBaseUrlClient.post<unknown>(
        API_ENDPOINTS.auth.userCheck,
        { phone: wire },
        undefined,
        { skipErrorRedirect: true },
    );

    return userCheckResponseSchema.parse(response);
}

/** POST /auth/register — creates an account for a phone number. */
export async function registerAccount(input: TRegisterInput): Promise<TRegisterResponse> {
    const data = registerInputSchema.parse(input);
    const phone = toWirePhone(data.phone);

    if (API_USE_MOCK) {
        return mockRegister(phone, data.password);
    }

    const response = await httpBaseUrlClient.post<unknown>(
        API_ENDPOINTS.auth.register,
        { ...data, phone },
        undefined,
        { skipErrorRedirect: true },
    );

    return registerResponseSchema.parse(response);
}

/** POST /auth/otp/verify — whether the OTP is correct for this phone number. */
export async function verifyOtp(input: TVerifyOtpInput): Promise<TVerifyOtpResponse> {
    const data = verifyOtpInputSchema.parse(input);
    const phone = toWirePhone(data.phone);

    if (API_USE_MOCK) {
        return mockVerifyOtp(data.code);
    }

    const response = await httpBaseUrlClient.post<unknown>(
        API_ENDPOINTS.auth.verifyOtp,
        { ...data, phone },
        undefined,
        { skipErrorRedirect: true },
    );

    return verifyOtpResponseSchema.parse(response);
}

/** POST /auth/otp/send — (re)sends the OTP for this phone number. */
export async function sendOtp(input: TSendOtpInput): Promise<TSendOtpResponse> {
    const data = sendOtpInputSchema.parse(input);
    const phone = toWirePhone(data.phone);

    if (API_USE_MOCK) {
        return mockSendOtp();
    }

    const response = await httpBaseUrlClient.post<unknown>(
        API_ENDPOINTS.auth.sendOtp,
        { phone },
        undefined,
        { skipErrorRedirect: true },
    );

    return sendOtpResponseSchema.parse(response);
}

/** POST /auth/password/login — whether the password matches this phone number. */
export async function loginWithPassword(
    input: TLoginWithPasswordInput,
): Promise<TLoginWithPasswordResponse> {
    const data = loginWithPasswordInputSchema.parse(input);
    const phone = toWirePhone(data.phone);

    if (API_USE_MOCK) {
        return mockLoginWithPassword(phone, data.password);
    }

    const response = await httpBaseUrlClient.post<unknown>(
        API_ENDPOINTS.auth.loginWithPassword,
        { ...data, phone },
        undefined,
        { skipErrorRedirect: true },
    );

    return loginWithPasswordResponseSchema.parse(response);
}
