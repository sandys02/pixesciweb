export function addOneYear(dateString: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return ""

  const [year, month, day] = dateString.split("-").map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  date.setUTCFullYear(date.getUTCFullYear() + 1)

  return date.toISOString().slice(0, 10)
}
