'use client';

import { useRouter } from 'next/navigation';

import { IconChip, type TIconChipTone } from '@/components/ui/icon-chip';
import { StaticImage } from '@/components/ui/static-image';

type TBackButtonProps = {
    /** Surface role of the chip; the auth header keeps the default sunken chip. */
    tone?: TIconChipTone;
    radiusClassName?: string;
    iconClassName?: string;
};

/** App-bar back control. Falls back to the home page when there is no history. */
export function BackButton({
    tone,
    radiusClassName,
    iconClassName = 'size-3.75',
}: TBackButtonProps = {}) {
    const router = useRouter();

    const handleClick = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push('/');
        }
    };

    return (
        <IconChip
            label="بازگشت"
            onClick={handleClick}
            tone={tone}
            radiusClassName={radiusClassName}
        >
            <span className={`relative ${iconClassName}`}>
                <StaticImage
                    src="/assets/icons/arrow-back.svg"
                    className="absolute inset-0 block size-full max-w-none"
                />
            </span>
        </IconChip>
    );
}
