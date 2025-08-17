export function formatTimeAgo(date: Date) {
  const diff = Date.now() - date.getTime()
  const s = Math.floor(diff / 1000)
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  if (h > 0) return `${h}h ago`
  if (m > 0) return `${m}m ago`
  return `${s}s ago`
}

export function severityColor(sev: "Low" | "Medium" | "High" | "Critical") {
  switch (sev) {
    case "Low":
      return "border-emerald-200 text-emerald-700"
    case "Medium":
      return "border-amber-200 text-amber-700"
    case "High":
      return "border-orange-200 text-orange-700"
    case "Critical":
      return "border-rose-200 text-rose-700"
    default:
      return ""
  }
}
