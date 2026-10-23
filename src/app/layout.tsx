import type { Metadata } from 'next';

import { Providers } from './providers';

import './globals.css';

export const metadata: Metadata = {
  title: 'پرسو | پلتفرم رزرو سالن های ورزشی',
  description: 'پلتفرم رزرو سالن های ورزشی',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-sans text-foreground">
        {/* eslint-disable-next-line @next/next/no-css-tags -- self-hosted Vazirmatn subsets live in /public/fonts/vazirmatn */}
        <link rel="stylesheet" href="/fonts/vazirmatn/css/vazirmatn.css" precedence="default" />
        <Providers>
          <div className="relative mx-auto flex min-h-dvh w-full max-w-97.5 flex-col bg-surface">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
