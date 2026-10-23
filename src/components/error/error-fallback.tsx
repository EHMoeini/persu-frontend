'use client';

import type { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function ErrorFallback({
  refetch,
}: {
  refetch?: (options?: RefetchOptions) => Promise<QueryObserverResult<unknown, Error>>;
}) {
  const router = useRouter();
  const handleClick = () => (refetch ?? router.refresh)();

  return (
    <>
      <span>Something went wrong</span>
      <button onClick={handleClick}>Try again</button>
    </>
  );
}
