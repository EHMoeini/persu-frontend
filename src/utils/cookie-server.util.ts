// Only for server actions and RSC.
import { cookies } from 'next/headers';

export type ServerCookieOptions = {
    path?: string;
    domain?: string;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'lax' | 'strict' | 'none';
    /** In seconds. */
    maxAge?: number;
};

export async function getServerCookie(name: string): Promise<string | undefined> {
    const store = await cookies();
    return store.get(name)?.value;
}

export async function setServerCookie(
    name: string,
    value: string,
    options: ServerCookieOptions = {},
): Promise<void> {
    const store = await cookies();
    store.set(name, value, {
        path: options.path ?? '/',
        domain: options.domain,
        httpOnly: options.httpOnly,
        secure: options.secure,
        sameSite: options.sameSite,
        maxAge: options.maxAge,
    });
}

export async function hasServerCookie(name: string): Promise<boolean> {
    const store = await cookies();
    return store.has(name);
}

export async function deleteServerCookie(name: string): Promise<void> {
    const store = await cookies();
    store.delete(name);
}
