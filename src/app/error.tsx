'use client';

import { useEffect } from 'react';

import ErrorBoundaryContent from '@/components/error/error-boundary-content';

type TErrorProps = {
    error: Error & { digest?: string; status?: number };
    retry: () => void;
};

export default function Error({ error, retry }: TErrorProps) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return <ErrorBoundaryContent error={error} retry={retry} />;
}
