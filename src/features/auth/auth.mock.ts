import type {
    TLoginWithPasswordResponse,
    TRegisterResponse,
    TSendOtpResponse,
    TVerifyOtpResponse,
} from './auth.schema';

/**
 * Mock auth responses while the backend is not ready (NEXT_PUBLIC_API_USE_MOCK).
 * Delete this module once the real API is live.
 */

/** Registered accounts and their passwords. */
const ACCOUNTS = new Map<string, string>([['09123456789', '12345678']]);

/** The only code that verifies in mock mode. */
const VALID_OTP = '1234';

/** Simulated latency so loading states behave like the real thing. */
const LATENCY_MS = 600;

const delay = () => new Promise((resolve) => setTimeout(resolve, LATENCY_MS));

export async function mockUserCheck(phone: string) {
    await delay();
    return { exists: ACCOUNTS.has(phone) };
}

export async function mockRegister(phone: string, password: string): Promise<TRegisterResponse> {
    await delay();
    ACCOUNTS.set(phone, password);
    return { registered: true };
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
    return { authenticated: ACCOUNTS.get(phone) === password };
}
