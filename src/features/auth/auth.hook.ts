'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { QUERY_KEYS } from '@/constants/query-keys.constant';
import { useAuthStore } from '@/stores/auth.store';
import { safeSessionStorage } from '@/utils/safe-storage.util';

import {
    checkUser,
    loginWithPassword,
    logout,
    registerAccount,
    sendOtp,
    verifyOtp,
} from './auth.client.endpoint';
import type { IAuthResponse } from './auth.models';
import type { NationalPhone } from './auth.phone';

const RESEND_SECONDS = 105;
const OTP_SENT_KEY_PREFIX = 'persu.otp.v1.sent.';

/** Persists the session, caches the user, and replaces the auth route. */
export function useApplySession() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useCallback(
        (session: IAuthResponse) => {
            useAuthStore.getState().setSession(session);
            queryClient.setQueryData(QUERY_KEYS.AUTH_SESSION, session.user);
            router.replace('/');
        },
        [queryClient, router],
    );
}

/** Runs the account-existence check for a phone number. */
export function useUserCheck() {
    return useMutation({ mutationFn: checkUser });
}

/** Creates an account, stores the returned session, and goes home. */
export function useRegisterAccount() {
    const applySession = useApplySession();
    return useMutation({ mutationFn: registerAccount, onSuccess: applySession });
}

/** Verifies an OTP, stores the returned session, and goes home. */
export function useVerifyOtp() {
    const applySession = useApplySession();
    return useMutation({ mutationFn: verifyOtp, onSuccess: applySession });
}

/** (Re)sends the OTP for a phone number. */
export function useSendOtp() {
    return useMutation({ mutationFn: sendOtp });
}

/** Authenticates a phone number with its password. */
export function useLoginWithPassword() {
    const applySession = useApplySession();
    return useMutation({ mutationFn: loginWithPassword, onSuccess: applySession });
}

/** Revokes the refresh-token family and clears local auth state. */
export function useLogout() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const refreshToken = useAuthStore.getState().refreshToken;
            if (!refreshToken) return;

            await logout(refreshToken);
        },
        onSettled: () => {
            useAuthStore.getState().clearSession();
            queryClient.setQueryData(QUERY_KEYS.AUTH_SESSION, null);
            router.replace('/user-check');
        },
    });
}

type TOtpFlowOptions = {
    /** Send the code when the flow mounts; guarded against Strict Mode. */
    autoSend?: boolean;
};

/** Shared OTP send/verify/countdown logic for login and the OTP screen. */
export function useOtpFlow(phone: NationalPhone, options: TOtpFlowOptions = {}) {
    const [code, setCode] = useState('');
    const [countdown, setCountdown] = useState(RESEND_SECONDS);
    const autoSentRef = useRef(false);
    const verify = useVerifyOtp();
    const send = useSendOtp();
    const sentKey = `${OTP_SENT_KEY_PREFIX}${phone}`;

    useEffect(() => {
        const id = setInterval(
            () => setCountdown((seconds) => (seconds > 0 ? seconds - 1 : 0)),
            1000,
        );

        return () => clearInterval(id);
    }, []);

    const sendCode = useCallback(
        (force = false) => {
            if (send.isPending) return;

            if (!force) {
                const lastSentAt = Number(safeSessionStorage.getItem(sentKey) ?? 0);
                if (lastSentAt > 0 && Date.now() - lastSentAt < 60_000) return;
            }

            send.mutate(
                { phone },
                {
                    onSuccess: () => {
                        safeSessionStorage.setItem(sentKey, String(Date.now()));
                        setCountdown(RESEND_SECONDS);
                    },
                    onError: () => {
                        safeSessionStorage.removeItem(sentKey);
                    },
                },
            );
        },
        [phone, send, sentKey],
    );

    useEffect(() => {
        if (!options.autoSend || autoSentRef.current) return;

        autoSentRef.current = true;
        sendCode();
    }, [options.autoSend, sendCode]);

    const submit = useCallback(
        (nextCode: string) => {
            if (nextCode.length !== 6 || verify.isPending) return;

            verify.mutate({ phone, code: nextCode });
        },
        [phone, verify],
    );

    const updateCode = useCallback(
        (nextCode: string) => {
            setCode(nextCode);
            if (nextCode.length === 6) submit(nextCode);
        },
        [submit],
    );

    const resend = useCallback(() => {
        if (countdown > 0) return;

        sendCode(true);
    }, [countdown, sendCode]);

    return {
        code,
        setCode: updateCode,
        submit,
        countdown,
        resend,
        verify,
        send,
    };
}
