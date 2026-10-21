import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

// React scopes this memoization to the current server request, preventing
// query data from surviving across users for the lifetime of the process.
const getQueryClient = cache(() => new QueryClient());

export default getQueryClient;
