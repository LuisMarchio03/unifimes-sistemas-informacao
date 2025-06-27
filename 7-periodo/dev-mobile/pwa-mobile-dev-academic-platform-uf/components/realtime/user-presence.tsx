"use client"

import { useUserPresence } from "@/lib/hooks/use-realtime"

interface UserPresenceProps {
  userId: string
  showStatus?: boolean
  size?: "sm" | "md" | "lg"
}

export function UserPresence({ userId, showStatus = true, size = "md" }: UserPresenceProps) {
  const { isUserOnline, getUserStatus, getLastSeen } = useUserPresence()

  const online = isUserOnline(userId)
  const status = getUserStatus(userId)
  const lastSeen = getLastSeen(userId)

  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  }

  const statusColors = {
    online: "bg-green-500",
    away: "bg-yellow-500",
    offline: "bg-gray-500",
  }

  const formatLastSeen = (timestamp?: number) => {
    if (!timestamp) return "Nunca visto"

    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return "Agora mesmo"
    if (minutes < 60) return `${minutes}m atrás`
    if (hours < 24) return `${hours}h atrás`
    return `${days}d atrás`
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className={`rounded-full ${sizeClasses[size]} ${statusColors[status]} ${online ? "animate-pulse" : ""}`} />
      </div>
      {showStatus && <span className="text-xs text-gray-400">{online ? "Online" : formatLastSeen(lastSeen)}</span>}
    </div>
  )
}
