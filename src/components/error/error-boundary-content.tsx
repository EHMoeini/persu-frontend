'use client';

import ErrorComponent from './error-component';

type TErrorBoundaryContentProps = {
    error: Error;
    retry: () => void;
};

export default function ErrorBoundaryContent({ retry }: TErrorBoundaryContentProps) {
    // `error` is available here for logging/reporting hooks when they are added.
    return <ErrorComponent statusCode={-1} onRetry={retry} />;
}
