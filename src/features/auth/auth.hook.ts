'use client';

import { useMutation } from '@tanstack/react-query';

import { checkUser } from './auth.client.endpoint';

/** Runs the account-existence check for a phone number. */
export function useCheckUser() {
  return useMutation({ mutationFn: checkUser });
}
