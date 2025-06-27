"use client"

import { useEffect } from "react"
import { useRealtimeMessages } from "@/lib/hooks/use-realtime"
import type { NotificationMessage } from "@/lib/websocket/types"
import { toast } from "sonner"
import { CheckCircle, AlertTriangle, Info, X } from "lucide-react"

export function RealtimeNotifications() {
  const notifications = useRealtimeMessages((message) => message.type === "notification") as NotificationMessage[]

  useEffect(() => {
    // Only show notifications from the last 5 seconds to avoid spam on page load
    const recentNotifications = notifications.filter((notification) => Date.now() - notification.timestamp < 5000)

    recentNotifications.forEach((notification) => {
      const { title, message, severity, actionUrl } = notification.payload

      const icons = {
        info: <Info className="h-4 w-4" />,
        success: <CheckCircle className="h-4 w-4" />,
        warning: <AlertTriangle className="h-4 w-4" />,
        error: <X className="h-4 w-4" />,
      }

      toast(title, {
        description: message,
        icon: icons[severity],
        action: actionUrl
          ? {
              label: "Ver",
              onClick: () => (window.location.href = actionUrl),
            }
          : undefined,
        duration: severity === "error" ? 10000 : 5000,
      })
    })
  }, [notifications])

  return null // This component only handles side effects
}
