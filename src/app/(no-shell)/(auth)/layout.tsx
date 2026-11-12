import type { ReactNode } from 'react';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthLegalNote } from '@/components/auth/auth-legal-note';

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <AuthHeader />
            {children}
            <AuthLegalNote />
        </>
    );
}
