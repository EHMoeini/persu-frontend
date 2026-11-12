import { BottomNav } from '@/components/bottom-nav/bottom-nav';
import Footer from '@/components/footer/footer';
import { FooterDivider } from '@/components/footer/footer-divider';
import { Header } from '@/components/header/header';
import type { ReactNode } from 'react';

export default function ShellLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Header />
            <main className="flex flex-1 flex-col">{children}</main>
            <FooterDivider />
            <Footer />
            <BottomNav />
        </>
    );
}
