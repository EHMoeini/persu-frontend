'use client';

import { API_ENDPOINTS, API_USE_MOCK } from '@/constants/api.constant';
import { httpBaseUrlClient } from '@/utils/http/http-client';

import { mockCheckUser } from './auth.mock';
import { checkUserResponseSchema, type TCheckUserResponse } from './auth.schema';

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
