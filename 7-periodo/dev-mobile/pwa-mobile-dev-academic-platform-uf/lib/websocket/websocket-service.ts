import { TaskUpdateMessage } from "@/lib/types/websocket"

// Número máximo de tentativas de reconexão
const MAX_RECONNECT_ATTEMPTS = 5

// Tempo entre tentativas de reconexão (em ms)
const RECONNECT_INTERVAL = 3000

export class WebSocketService {
  private socket: WebSocket | null = null
  private messageHandlers: ((message: TaskUpdateMessage) => void)[] = []
  private reconnectAttempts = 0
  private isConnecting = false
  private rooms = new Set<string>()

  constructor(private url: string) {}

  private connect() {
    if (this.socket?.readyState === WebSocket.OPEN || this.isConnecting) {
      return
    }

    this.isConnecting = true

    try {
      this.socket = new WebSocket(this.url)
      
      this.socket.onopen = () => {
        console.log("WebSocket connected")
        this.isConnecting = false
        this.reconnectAttempts = 0

        // Reconectar às salas
        this.rooms.forEach(room => {
          this.joinRoom(room)
        })
      }

      this.socket.onclose = () => {
        console.log("WebSocket disconnected")
        this.socket = null
        this.isConnecting = false
        this.handleReconnect()
      }

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error)
        this.socket?.close()
      }

      this.socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as TaskUpdateMessage
          this.messageHandlers.forEach(handler => handler(message))
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
        }
      }
    } catch (error) {
      console.error("Error connecting to WebSocket:", error)
      this.isConnecting = false
      this.handleReconnect()
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error("Max reconnection attempts reached")
      return
    }

    this.reconnectAttempts++
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`)
    
    setTimeout(() => {
      this.connect()
    }, RECONNECT_INTERVAL)
  }

  public joinRoom(roomId: string) {
    this.rooms.add(roomId)
    
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: "join_room",
        roomId
      }))
    } else {
      this.connect()
    }
  }

  public leaveRoom(roomId: string) {
    this.rooms.delete(roomId)
    
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: "leave_room",
        roomId
      }))
    }
  }

  public sendMessage(message: TaskUpdateMessage) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
    } else {
      console.warn("WebSocket not connected. Message not sent:", message)
      this.connect()
    }
  }

  public subscribe(handler: (message: TaskUpdateMessage) => void) {
    this.messageHandlers.push(handler)
    return () => {
      const index = this.messageHandlers.indexOf(handler)
      if (index !== -1) {
        this.messageHandlers.splice(index, 1)
      }
    }
  }

  public close() {
    this.socket?.close()
    this.socket = null
    this.messageHandlers = []
    this.rooms.clear()
    this.reconnectAttempts = 0
  }
}
