import { Header } from '@/components/header/header';
import type { ReactNode } from 'react';

export default function ShellLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <div className="sticky top-0 right-0 z-20 w-full">
                <Header />
            </div>
            <main className="flex flex-1 flex-col">{children}</main>
        </>
    );
}
