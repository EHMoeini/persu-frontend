'use client';

import { useMutation } from '@tanstack/react-query';

import { checkUser, loginWithPassword, sendOtp, verifyOtp } from './auth.client.endpoint';

/** Runs the account-existence check for a phone number. */
export function useCheckUser() {
  return useMutation({ mutationFn: checkUser });
}

/** Verifies an OTP for a phone number. */
export function useVerifyOtp() {
  return useMutation({ mutationFn: verifyOtp });
}

/** (Re)sends the OTP for a phone number. */
export function useSendOtp() {
  return useMutation({ mutationFn: sendOtp });
}

/** Authenticates a phone number with its password. */
export function useLoginWithPassword() {
  return useMutation({ mutationFn: loginWithPassword });
}
