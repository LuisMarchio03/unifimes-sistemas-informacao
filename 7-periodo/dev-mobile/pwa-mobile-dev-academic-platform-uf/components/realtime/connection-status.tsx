"use client"

import { useWebSocketStore } from "@/lib/websocket/websocket-store"
import { Wifi, WifiOff } from "lucide-react"

export function ConnectionStatus() {
  const isConnected = useWebSocketStore((state) => state.isConnected)

  return (
    <div className="flex items-center gap-2 text-xs">
      {isConnected ? (
        <>
          <Wifi className="h-3 w-3 text-green-500" />
          <span className="text-green-500">Online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3 text-red-500" />
          <span className="text-red-500">Offline</span>
        </>
      )}
    </div>
  )
}
