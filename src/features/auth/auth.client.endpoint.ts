'use client';

import { API_ENDPOINTS, API_USE_MOCK } from '@/constants/api.constant';
import { httpBaseUrlClient } from '@/utils/http/http-client';

import { mockCheckUser, mockLoginWithPassword, mockSendOtp, mockVerifyOtp } from './auth.mock';
import {
  checkUserResponseSchema,
  loginWithPasswordResponseSchema,
  sendOtpResponseSchema,
  verifyOtpResponseSchema,
  type TCheckUserResponse,
  type TLoginWithPasswordInput,
  type TLoginWithPasswordResponse,
  type TSendOtpInput,
  type TSendOtpResponse,
  type TVerifyOtpInput,
  type TVerifyOtpResponse,
} from './auth.schema';

/**
 * POST /auth/check-user — whether an account exists for this phone number.
 * Served by the local mock while `NEXT_PUBLIC_API_USE_MOCK` is on.
 */
export async function checkUser(phone: string): Promise<TCheckUserResponse> {
  if (API_USE_MOCK) {
    return mockCheckUser(phone);
  }

  const response = await httpBaseUrlClient.post<unknown>(
    API_ENDPOINTS.auth.checkUser,
    { phone },
    undefined,
    { skipErrorRedirect: true },
  );

  return checkUserResponseSchema.parse(response);
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
