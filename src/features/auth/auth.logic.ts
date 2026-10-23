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

/** The value kept in state: digits only, Latin, capped at 11. */
export function normalizePhoneInput(input: string): string {
  return toLatinDigits(input).replace(/\D/g, '').slice(0, 11);
}

/** Iranian mobile: 11 digits starting with 09. */
export function isValidIranianMobile(phone: string): boolean {
  return /^09\d{9}$/.test(phone);
}
