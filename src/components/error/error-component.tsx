'use client';

import Link from 'next/link';

type TErrorComponentProps = {
  statusCode: number;
  onRetry?: () => void;
};

export default function ErrorComponent({ statusCode, onRetry }: TErrorComponentProps) {
  let title = 'Something went wrong';
  let text = 'Please try again.';
  let buttonText = 'Try again';

  const handleBackOrHome = () => {
    if (onRetry) {
      onRetry();
      return;
    }

    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      window.location.replace('/');
    }
  };

  switch (statusCode) {
    case 502:
      title = 'Service temporarily unavailable';
      text = 'We are fixing it and will be back shortly.';
      break;
    case 500:
      title = 'Server error';
      text = 'Something broke on our side. Please try again.';
      break;
    case 401:
      buttonText = 'Sign in';
      text = 'You need to sign in to view this page.';
      break;
    case 0:
      title = 'You are offline';
      text = 'Check your internet connection and try again.';
      break;
  }

  return (
    <div data-nosnippet="">
      <h3>{title}</h3>
      <p>{text}</p>
      {statusCode === 401 ? (
        <Link href="/login">{buttonText}</Link>
      ) : (
        <button onClick={handleBackOrHome}>{buttonText}</button>
      )}
    </div>
  );
}
