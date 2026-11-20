import { StaticImage } from '@/components/ui/static-image';

const AVATAR_PLACEHOLDER = '/assets/images/avatar-placeholder.svg';

type TProfileAvatarProps = {
    src?: string;
    className: string;
};

/** Avatar, falling back to the design placeholder when no URL is set. */
export function ProfileAvatar({ src, className }: TProfileAvatarProps) {
    return <StaticImage src={src || AVATAR_PLACEHOLDER} className={className} />;
}
