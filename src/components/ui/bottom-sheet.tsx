'use client';

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import type { ReactNode } from 'react';

import { TextButton } from './text-button';

type TBottomSheetProps = {
    open: boolean;
    onClose: () => void;
    title: string;
    closeLabel?: string;
    /** When false, backdrop/ESC/close controls are disabled (e.g. while saving). */
    dismissible?: boolean;
    children: ReactNode;
};

/**
 * Bottom drawer built on Headless UI's Dialog primitives. Headless UI ships
 * Dialog rather than a dedicated Drawer; placing the panel at the bottom edge
 * gives the drawer behavior while keeping focus trapping, scroll locking,
 * ESC and outside-click handling from the primitive.
 */
export function BottomSheet({
    open,
    onClose,
    title,
    closeLabel = 'بستن',
    dismissible = true,
    children,
}: TBottomSheetProps) {
    const requestClose = () => {
        if (dismissible) onClose();
    };

    return (
        <Dialog open={open} onClose={requestClose} className="relative z-50">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-foreground/50 duration-[400ms] ease-in-out data-closed:opacity-0 data-leave:duration-200 data-leave:ease-out motion-reduce:transition-none"
            />

            <div className="fixed inset-0 flex items-end justify-center">
                <DialogPanel
                    transition
                    className="flex max-h-[calc(100dvh-2rem)] w-full max-w-97.5 flex-col overflow-y-auto rounded-t-3xl bg-surface-card p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] text-foreground shadow-floating duration-[400ms] ease-in-out data-closed:translate-y-full data-leave:duration-200 data-leave:ease-out motion-reduce:transition-none"
                >
                    <div className="flex items-center justify-between gap-3">
                        <DialogTitle className="text-base leading-6 font-bold text-foreground">
                            {title}
                        </DialogTitle>
                        <TextButton onClick={requestClose} disabled={!dismissible}>
                            {closeLabel}
                        </TextButton>
                    </div>

                    <div className="mt-4">{children}</div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
