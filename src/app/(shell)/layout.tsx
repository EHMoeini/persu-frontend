import { BottomNav, StaticBottomNav } from '@/components/bottom-nav/bottom-nav';
import Footer from '@/components/footer/footer';
import { FooterDivider } from '@/components/footer/footer-divider';
import { Header, StaticHeader } from '@/components/header/header';
import { Suspense, type ReactNode } from 'react';

export default function ShellLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {/*
             * Header reads the pathname to pick the landing or static variant.
             * On routes with dynamic params the pathname is only known at request
             * time, so the boundary keeps the shell prerenderable. The fallback is
             * the same header those routes resolve to, so nothing visibly swaps.
             */}
            <Suspense fallback={<StaticHeader />}>
                <Header />
            </Suspense>
            <main className="flex flex-1 flex-col">{children}</main>
            <FooterDivider />
            <Footer />
            {/*
             * Same reason as the Header above: BottomNav reads the pathname for
             * the active item, which a dynamic route only knows at request time.
             */}
            <Suspense fallback={<StaticBottomNav />}>
                <BottomNav />
            </Suspense>
        </>
    );
}
