/** Persian and Arabic-Indic digits, indexed by their Latin value. */
const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

/** Converts Persian/Arabic digits to Latin; other characters pass through. */
export function toLatinDigits(input: string): string {
    return input.replace(/[۰-۹٠-٩]/g, (digit) => {
        const persianIndex = PERSIAN_DIGITS.indexOf(digit);
        if (persianIndex !== -1) return String(persianIndex);
        return String(ARABIC_DIGITS.indexOf(digit));
    });
}

/** Renders Latin digits as Persian digits for display. */
export function toPersianDigits(input: string): string {
    return input.replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

/** The OTP value kept in state: digits only, Latin, capped at 4. */
export function normalizeOtpInput(input: string): string {
    return toLatinDigits(input).replace(/\D/g, '').slice(0, 4);
}

/** mm:ss countdown in Persian digits, zero-padded. */
export function formatCountdown(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return toPersianDigits(
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
    );
}
