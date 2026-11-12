/** Display models for the account screen. Replace with the profile API wire models. */

export interface IProfile {
    /** Canonical international phone, e.g. `+989123456789`. */
    phone: string;
    /** Account role label shown under the phone. */
    role: string;
    /** Placeholder until the user's avatar is wired to the API. */
    avatarSrc: string;
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
