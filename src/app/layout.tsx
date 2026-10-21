import type { Metadata } from 'next';

import { Providers } from './providers';

import './globals.css';

export const metadata: Metadata = {
  title: 'پرسو | پلتفرم رزرو سالن های ورزشی',
  description: 'پلتفرم رزرو سالن های ورزشی',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
