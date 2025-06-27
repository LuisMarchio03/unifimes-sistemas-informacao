"use client"

import { useCallback, useEffect, useMemo } from "react"
import { useWebSocketStore } from "../websocket/websocket-store"
import type { TaskUpdateMessage } from "../types/websocket"
import type { WSTaskUpdateMessage } from "../websocket/types"

// Variável para rastrear se já tentamos conectar
let hasTriedToConnect = false

export function useRealtime() {
  const wsStore = useWebSocketStore()

  useEffect(() => {
    // Tentar conectar apenas uma vez em toda a aplicação
    if (!wsStore.isConnected && !hasTriedToConnect) {
      hasTriedToConnect = true
      wsStore.connect().catch(err => {
        console.error("Falha ao conectar ao WebSocket:", err)
        hasTriedToConnect = false // Permitir tentar novamente em caso de erro
      })
    }

    return () => {
      // Don't disconnect on unmount to maintain connection across pages
    }
  }, [wsStore])

  const subscribeToRoom = useCallback(
    (roomId: string) => {
      wsStore.subscribeToRoom(roomId)
    },
    [wsStore],
  )

  const unsubscribeFromRoom = useCallback(
    (roomId: string) => {
      wsStore.unsubscribeFromRoom(roomId)
    },
    [wsStore],
  )

  const send = useCallback(
    (message: TaskUpdateMessage) => {
      wsStore.sendMessage(message)
    },
    [wsStore],
  )

  return {
    isConnected: wsStore.isConnected,
    subscribeToRoom,
    unsubscribeFromRoom,
    sendMessage: send,
  }
}

export function useRealtimeMessages(filter?: (message: TaskUpdateMessage) => boolean) {
  const wsStore = useWebSocketStore()

  return useMemo(() => {
    const taskMessages = wsStore.messages
      .filter((msg): msg is WSTaskUpdateMessage => 
        msg.type.startsWith('task_'))
      
    if (filter) {
      return taskMessages.filter((msg) => {
        // Converter WSTaskUpdateMessage para TaskUpdateMessage
        const taskMsg: TaskUpdateMessage = {
          type: msg.type as TaskUpdateMessage["type"],
          payload: msg.payload,
          roomId: msg.roomId!
        }
        return filter(taskMsg)
      })
    }
    
    return taskMessages.map((msg): TaskUpdateMessage => ({
      type: msg.type as TaskUpdateMessage["type"],
      payload: msg.payload,
      roomId: msg.roomId!
    }))
  }, [wsStore.messages, filter])
}
