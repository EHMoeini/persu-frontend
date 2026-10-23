import type { ReactNode } from 'react';

import { AuthLegalNote } from '@/components/auth/auth-legal-note';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <AuthLegalNote />
    </>
  );
}
