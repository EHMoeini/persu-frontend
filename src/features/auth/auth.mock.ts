import type { TCheckUserResponse } from './auth.schema';

/**
 * Mock auth responses while the backend is not ready (NEXT_PUBLIC_API_USE_MOCK).
 * Delete this module once the real API is live.
 */

/** Numbers in this list resolve as existing accounts — everything else registers. */
const REGISTERED_PHONES = ['09123456789'];

/** Simulated latency so loading states behave like the real thing. */
const LATENCY_MS = 600;

export async function mockCheckUser(phone: string): Promise<TCheckUserResponse> {
  await new Promise((resolve) => setTimeout(resolve, LATENCY_MS));
  return { exists: REGISTERED_PHONES.includes(phone) };
}
