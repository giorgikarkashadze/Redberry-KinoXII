export function splitLabel(label: string) {
  const match = /^(.*?)\s*\((.*)\)$/.exec(label)
  if (!match) return { name: label, hint: '' }
  return { name: match[1] ?? label, hint: match[2] ?? '' }
}