'use client';

import { useSession } from '../auth.query';

/** Restores the session on app load. */
export function AuthSessionBootstrap() {
    useSession();

    return null;
}
