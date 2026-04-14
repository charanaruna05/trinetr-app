export async function requestNotificationPermission() {
  if (!("Notification" in window)) return false
  if (Notification.permission === "granted") return true
  if (Notification.permission === "denied") return false
  const p = await Notification.requestPermission()
  return p === "granted"
}

export function sendNotification(title, body) {
  if (Notification.permission !== "granted") return
  const n = new Notification(title, { body, tag: "trishul" })
  setTimeout(() => n.close(), 8000)
}

export const NOTIF_TYPES = {
  BUY:   { emoji: "🟢", color: "#00c853" },
  SELL:  { emoji: "🔴", color: "#ff3d00" },
  ALERT: { emoji: "⚠️", color: "#ff9800" },
  INFO:  { emoji: "ℹ️", color: "#2196f3" },
}
