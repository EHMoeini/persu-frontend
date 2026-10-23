'use client';

type SnackbarMessage = {
  message: string;
  variant?: 'error' | 'warning' | 'info' | 'success' | 'default';
};

type SnackbarListener = (message: SnackbarMessage) => void;

class SnackbarEvents {
  private listeners: SnackbarListener[] = [];

  subscribe(listener: SnackbarListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  emit(message: string, variant: SnackbarMessage['variant'] = 'default') {
    this.listeners.forEach((listener) => {
      listener({ message, variant });
    });
  }
}

export const snackbarEvents = new SnackbarEvents();
