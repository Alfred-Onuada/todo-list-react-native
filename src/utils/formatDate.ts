export default function formatDate(date: Date): string {
  const d = new Date(date)
  const month = d.toLocaleString('default', { month: 'short' })
  const day = d.getDate()
  const year = d.getFullYear()
  const hours = (d.getHours() < 10 ? '0' : '') + d.getHours()
  const minutes = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes()

  return `${month} ${day}, ${year} ${hours}:${minutes}`
}