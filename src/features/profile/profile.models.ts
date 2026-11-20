/** Wire and display models for the account screen. */

export interface IProfile {
    id: string;
    /** E.164 phone number, e.g. `+989123456789`. */
    phone: string;
    /** Optional display name; omitted when empty. */
    nickName?: string;
    /** Optional avatar URL; omitted when empty. */
    avatar?: string;
}

export interface IProfileResponse {
    user: IProfile;
}

export interface IProfileUpdate {
    /** Empty string clears the display name. */
    nickName?: string;
}

export interface IWalletSummary {
    /** Balance in Toman. */
    balance: number;
}

export interface IPlusMembership {
    statusLabel: string;
    title: string;
    description: string;
}

export interface IProfileMenuItem {
    id: string;
    label: string;
    href: string;
    /** Design asset served from `/public`. */
    icon: string;
    /** Intrinsic icon box from the design. */
    iconClassName: string;
}
