import { toLatinDigits, toPersianDigits } from './auth.logic';

/**
 * Phone-number value model.
 *
 * The app stores one canonical form — `NationalPhone`, the 10-digit national
 * number without the dialing trunk `0` (e.g. `9123456789`). The auth API wants
 * the trunk-`0` form (`09…`) plus a country code, modelled by `WirePhone`.
 * Both conversions live here, so no component needs to know where the `0` lives.
 */

/** Country code sent with every auth request. */
export const AUTH_COUNTRY_CODE = 'IR';

/** Canonical in-app form: national 10 digits, no trunk `0`. */
export type NationalPhone = string & { readonly __phone: 'national' };

/** The form the auth API expects on the wire: `09…`. */
export type WirePhone = string & { readonly __phone: 'wire' };

/**
 * Field draft: sanitized digits, country prefix and trunk `0` stripped, capped
 * at 10. Accepts Persian/Arabic digits and pasted `+98` / `0098` / `98` forms.
 * This is the value the input keeps while typing — it may be incomplete, so it
 * is not a validated `NationalPhone`.
 */
export function toPhoneDraft(input: string): string {
    let digits = toLatinDigits(input).replace(/\D/g, '');

    if (digits.startsWith('0098')) {
        digits = digits.slice(4);
    } else if (digits.startsWith('98') && digits.length > 10) {
        digits = digits.slice(2);
    }

    return digits.replace(/^0+/, '').slice(0, 10);
}

/** Parses any representation (with/without the trunk `0`, Persian/Latin) into the canonical form. */
export function parsePhone(input: string): NationalPhone | null {
    const national = toPhoneDraft(input);
    return /^9\d{9}$/.test(national) ? (national as NationalPhone) : null;
}

/** The only place the trunk `0` is re-added. */
export function toWirePhone(phone: NationalPhone): WirePhone {
    return `0${phone}` as WirePhone;
}

/** Formats a phone for display in Persian digits; `masked` hides the middle block. */
export function formatPhone(phone: NationalPhone, style: 'plain' | 'masked' = 'plain'): string {
    if (style === 'masked') {
        return `+۹۸ ${toPersianDigits(phone.slice(0, 3))} *** ${toPersianDigits(phone.slice(6))}`;
    }

    return toPersianDigits(phone);
}
