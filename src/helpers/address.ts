/**
 * Formats a Taiwanese address by removing city name and zip code
 * @param address - Full address string (e.g. "臺中市407西屯區東興路三段412-1號")
 * @returns Formatted address without city and zip code (e.g. "西屯區東興路三段412-1號")
 */
export function formatAddress(address: string): string {
  // Remove city name (e.g. "臺中市")
  const withoutCity = address.replace(/^[^市]*(市)/, '')
  // Remove zip code (3 digits)
  return withoutCity.replace(/^\d{3}/, '').trim()
}
