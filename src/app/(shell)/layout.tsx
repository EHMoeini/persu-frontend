import type { ReactNode } from 'react';

import { Header } from '@/components/header/header';

export default function ShellLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col pt-16">{children}</main>
    </>
  );
}
