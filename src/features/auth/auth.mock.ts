import type {
  TLoginWithPasswordResponse,
  TSendOtpResponse,
  TVerifyOtpResponse,
} from './auth.schema';

/**
 * Mock auth responses while the backend is not ready (NEXT_PUBLIC_API_USE_MOCK).
 * Delete this module once the real API is live.
 */

/** Numbers in this list resolve as existing accounts — everything else registers. */
const REGISTERED_PHONES = ['09123456789'];

/** The only code that verifies in mock mode. */
const VALID_OTP = '1234';

/** The only password that authenticates in mock mode. */
const VALID_PASSWORD = '12345678';

/** Simulated latency so loading states behave like the real thing. */
const LATENCY_MS = 600;

const delay = () => new Promise((resolve) => setTimeout(resolve, LATENCY_MS));

export async function mockCheckUser(phone: string) {
  await delay();
  return { exists: REGISTERED_PHONES.includes(phone) };
}

export async function mockVerifyOtp(code: string): Promise<TVerifyOtpResponse> {
  await delay();
  return { verified: code === VALID_OTP };
}

export async function mockSendOtp(): Promise<TSendOtpResponse> {
  await delay();
  return { sent: true };
}

export async function mockLoginWithPassword(
  phone: string,
  password: string,
): Promise<TLoginWithPasswordResponse> {
  await delay();
  return { authenticated: REGISTERED_PHONES.includes(phone) && password === VALID_PASSWORD };
}
