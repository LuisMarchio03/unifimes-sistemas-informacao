import { create } from "zustand"
import type { WebSocketStore, WSMessage, UserPresenceMessage } from "./types"
import { mockWebSocket } from "./mock-websocket"

export const useWebSocketStore = create<WebSocketStore>((set, get) => ({
  isConnected: false,
  messages: [],
  userPresence: {},

  connect: async () => {
    try {
      await mockWebSocket.connect()

      // Subscribe to all messages
      mockWebSocket.subscribe("all", (message: WSMessage) => {
        set((state) => ({
          messages: [...state.messages.slice(-99), message], // Keep last 100 messages
        }))

        // Handle user presence updates
        if (message.type === "user_online" || message.type === "user_offline") {
          const presenceMessage = message as UserPresenceMessage
          set((state) => ({
            userPresence: {
              ...state.userPresence,
              [presenceMessage.payload.userId]: presenceMessage.payload,
            },
          }))
        }
      })

      mockWebSocket.subscribe("connection", () => {
        set({ isConnected: true })
      })

      mockWebSocket.subscribe("disconnection", () => {
        set({ isConnected: false })
      })
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error)
    }
  },

  disconnect: () => {
    mockWebSocket.disconnect()
    set({
      isConnected: false,
      messages: [],
      userPresence: {},
    })
  },

  sendMessage: (message: Omit<WSMessage, "id" | "timestamp">) => {
    mockWebSocket.send(message)
  },

  subscribeToRoom: (roomId: string) => {
    // Guardar as salas que o usuário já se inscreveu para evitar inscrições duplicadas
    const store = get();
    if (roomId && store.isConnected) {
      mockWebSocket.joinRoom(roomId);
    }
  },

  unsubscribeFromRoom: (roomId: string) => {
    // Verificar se estamos conectados antes de tentar deixar a sala
    const store = get();
    if (roomId && store.isConnected) {
      // Usar setTimeout para evitar que o unsubscribe aconteça durante o ciclo de renderização
      setTimeout(() => {
        mockWebSocket.leaveRoom(roomId);
      }, 0);
    }
  },

  clearMessages: () => {
    set({ messages: [] })
  },
}))
