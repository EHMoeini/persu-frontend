'use client';

import { formatCountdown } from '../auth.logic';

type TResendOtpRowProps = {
    /** Seconds left before a resend is allowed; the action stays disabled while positive. */
    countdown: number;
    onResend: () => void;
    /** Set while the resend request is in flight. */
    pending?: boolean;
};

/**
 * Resend row — the shared element used by the login and registration OTP cards.
 * The action sits at the inline start and the cooldown at the inline end.
 */
export function ResendOtpRow({ countdown, onResend, pending }: TResendOtpRowProps) {
    return (
        <div className="flex items-center justify-between px-1">
            <button
                type="button"
                onClick={onResend}
                disabled={countdown > 0 || pending}
                className="text-[11px] leading-4.25 text-primary disabled:cursor-not-allowed disabled:text-outline"
            >
                ارسال مجدد کد
            </button>
            <span className="text-[11px] leading-4.25 text-primary">
                {formatCountdown(countdown)}
            </span>
        </div>
    );
}
