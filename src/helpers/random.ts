export function generateRandomIP() {
  const octets = Array.from({ length: 4 }, () => Math.floor(Math.random() * 256))
  return octets.join('.')
}
