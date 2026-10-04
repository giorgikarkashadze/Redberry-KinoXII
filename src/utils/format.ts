export function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()
}

export function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

export function formatMobile(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 9)
  return digits.replace(/(\d{3})(?=\d)/g, '$1 ')
}

export function formatCvv(value: string) {
  return value.replace(/\D/g, '').slice(0, 3)
}