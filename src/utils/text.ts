export function splitLabel(label: string) {
  const match = /^(.*?)\s*\((.*)\)$/.exec(label)
  if (!match) return { name: label, hint: '' }
  return { name: match[1] ?? label, hint: match[2] ?? '' }
}

export function splitMatch(text: string, term: string) {
  const index = term ? text.toLowerCase().indexOf(term.toLowerCase()) : -1
  if (index < 0) return { before: '', match: text, after: '' }
  return {
    before: text.slice(0, index),
    match: text.slice(index, index + term.length),
    after: text.slice(index + term.length),
  }
}