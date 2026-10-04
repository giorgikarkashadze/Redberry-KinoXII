export function ticketSummary(items: { ticketType: { name: string } }[]) {
  const counts = new Map<string, number>()
  for (const item of items) {
    counts.set(item.ticketType.name, (counts.get(item.ticketType.name) ?? 0) + 1)
  }
  return [...counts.entries()].map(([name, count]) => `${count} x ${name}`).join(', ')
}