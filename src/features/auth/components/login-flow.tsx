'use client';

import { useState } from 'react';

import { AuthSectionHeader } from '@/components/auth/auth-section-header';

import { LoginForm } from './login-form';
import { PasswordLoginForm } from './password-login-form';

const OTP_SUBTITLE = 'کد تأیید ارسال‌شده به شماره همراه خود را وارد نمایید.';
const PASSWORD_SUBTITLE = 'کلمه عبور حساب کاربری خود را وارد نمایید.';

type TLoginMode = 'otp' | 'password';

/** Login screen header and card — the OTP/password mode switch lives here. */
export function LoginFlow({ phone }: { phone: string }) {
  const [mode, setMode] = useState<TLoginMode>('otp');
  const isOtp = mode === 'otp';

  return (
    <>
      <AuthSectionHeader
        icon="/assets/icons/login-enter.svg"
        title="ورود به حساب کاربری"
        subtitle={isOtp ? OTP_SUBTITLE : PASSWORD_SUBTITLE}
      />

      {isOtp ? (
        <LoginForm phone={phone} onUsePassword={() => setMode('password')} />
      ) : (
        <PasswordLoginForm phone={phone} onUseOtp={() => setMode('otp')} />
      )}
    </>
  );
}
