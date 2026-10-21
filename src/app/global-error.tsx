'use client';

import { useEffect } from 'react';

import ErrorComponent from '@/components/error/error-component';

import './globals.css';

type TGlobalErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function GlobalError({ error, retry }: TGlobalErrorProps) {
  useEffect(() => {
    // Report/observe the error here (console, analytics, ...).
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>Error</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ErrorComponent statusCode={-1} onRetry={retry} />
      </body>
    </html>
  );
}
