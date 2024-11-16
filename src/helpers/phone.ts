/**
 * Formats a Taiwanese phone number to local format (0X-XXXXXXXX)
 * Handles numbers with or without country code (886)
 *
 * @param phone - The phone number string to format (e.g. '886-4-23286034' or '04-23286034')
 * @returns The formatted local phone number
 *
 * @example
 * formatTaiwanPhoneNumber('886-4-23286034') // Returns '04-23286034'
 * formatTaiwanPhoneNumber('04-23286034')    // Returns '04-23286034'
 */
export function formatTaiwanPhoneNumber(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, '')

  const localNumber = digitsOnly.startsWith('886') ? digitsOnly.slice(3) : digitsOnly

  const formattedNumber = localNumber.startsWith('4') ? `0${localNumber}` : localNumber

  return formattedNumber.replace(/(\d{2})(\d{8})/, '$1-$2')
}
