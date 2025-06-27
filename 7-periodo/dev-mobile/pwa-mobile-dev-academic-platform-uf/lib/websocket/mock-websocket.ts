import type { WSMessage } from "./types"
import type { TaskStatus, TaskPriority } from "../types/task"

export class MockWebSocket {
  private listeners: Map<string, Set<(message: WSMessage) => void>> = new Map()
  private rooms: Set<string> = new Set()
  private isConnected = false
  private heartbeatInterval?: NodeJS.Timeout
  private simulationInterval?: NodeJS.Timeout

  connect(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = true
        this.startHeartbeat()
        this.startSimulation()
        this.emit("connection", {
          id: crypto.randomUUID(),
          type: "connection" as const,
          payload: { status: "connected" },
          timestamp: Date.now(),
        })
        resolve()
      }, 500) // Simulate connection delay
    })
  }

  disconnect(): void {
    this.isConnected = false
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval)
    }
    this.emit("disconnection", {
      id: crypto.randomUUID(),
      type: "disconnection" as const,
      payload: { status: "disconnected" },
      timestamp: Date.now(),
    })
  }

  subscribe(event: string, callback: (message: WSMessage) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback)
    }
  }

  send(message: Omit<WSMessage, "id" | "timestamp">): void {
    if (!this.isConnected) {
      console.warn("WebSocket not connected")
      return
    }

    const fullMessage: WSMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    }

    // Simulate server processing delay
    setTimeout(() => {
      this.emit("message", fullMessage)
    }, 100)
  }

  joinRoom(roomId: string): void {
    this.rooms.add(roomId)
    this.emit("room_joined", {
      id: crypto.randomUUID(),
      type: "room_joined" as const,
      payload: { roomId },
      timestamp: Date.now(),
      roomId,
    })
  }

  leaveRoom(roomId: string): void {
    if (this.rooms.has(roomId)) {
      this.rooms.delete(roomId)
      
      // Só emitir o evento se o WebSocket ainda estiver conectado
      if (this.isConnected) {
        this.emit("room_left", {
          id: crypto.randomUUID(),
          type: "room_left" as const,
          payload: { roomId },
          timestamp: Date.now(),
          roomId,
        })
      }
    }
  }

  private emit(event: string, message: WSMessage): void {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach((callback) => callback(message))
    }

    // Also emit to 'all' listeners
    const allCallbacks = this.listeners.get("all")
    if (allCallbacks) {
      allCallbacks.forEach((callback) => callback(message))
    }
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        this.emit("heartbeat", {
          id: crypto.randomUUID(),
          type: "heartbeat" as const,
          payload: { timestamp: Date.now() },
          timestamp: Date.now(),
        })
      }
    }, 30000) // Every 30 seconds
  }

  private startSimulation(): void {
    // Simulate random real-time events
    this.simulationInterval = setInterval(() => {
      if (this.isConnected && Math.random() > 0.7) {
        this.simulateRandomEvent()
      }
    }, 5000) // Every 5 seconds, 30% chance
  }

  private simulateRandomEvent(): void {
    const events = [
      this.simulateTaskUpdate,
      this.simulateUserPresence,
      this.simulateNotification,
      this.simulateTeamUpdate,
    ]

    const randomEvent = events[Math.floor(Math.random() * events.length)]
    randomEvent.call(this)
  }

  private simulateTaskUpdate(): void {
    const taskUpdates = [
      {
        type: "task_updated" as const,
        payload: {
          taskId: "task1",
          projectId: "project1",
          changes: { status: "in-progress" as TaskStatus },
          updatedBy: "user2",
        },
      },
      {
        type: "task_created" as const,
        payload: {
          taskId: crypto.randomUUID(),
          projectId: "project1",
          changes: {
            title: "Nova tarefa criada automaticamente",
            status: "todo" as TaskStatus,
            priority: "medium" as TaskPriority,
          },
          updatedBy: "user3",
        },
      },
    ]

    const update = taskUpdates[Math.floor(Math.random() * taskUpdates.length)]
    this.emit("message", {
      id: crypto.randomUUID(),
      ...update,
      timestamp: Date.now(),
    })
  }

  private simulateUserPresence(): void {
    const users = ["user1", "user2", "user3", "user4", "user5"]
    const statuses = ["online", "offline", "away"] as const

    const randomUser = users[Math.floor(Math.random() * users.length)]
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

    // Definir o tipo explicitamente sem usar 'as const' na expressão condicional
    const messageType: "user_offline" | "user_online" = randomStatus === "offline" ? "user_offline" : "user_online";
    
    this.emit("message", {
      id: crypto.randomUUID(),
      type: messageType,
      payload: {
        userId: randomUser,
        status: randomStatus,
        lastSeen: Date.now(),
      },
      timestamp: Date.now(),
    })
  }

  private simulateNotification(): void {
    const notifications = [
      {
        title: "Nova mensagem",
        message: "Você recebeu uma nova mensagem no projeto",
        severity: "info" as const,
      },
      {
        title: "Tarefa atualizada",
        message: "Uma tarefa foi marcada como concluída",
        severity: "success" as const,
      },
      {
        title: "Prazo próximo",
        message: "Uma tarefa tem prazo para amanhã",
        severity: "warning" as const,
      },
    ]

    const notification = notifications[Math.floor(Math.random() * notifications.length)]

    this.emit("message", {
      id: crypto.randomUUID(),
      type: "notification" as const,
      payload: notification,
      timestamp: Date.now(),
    })
  }

  private simulateTeamUpdate(): void {
    this.emit("message", {
      id: crypto.randomUUID(),
      type: "team_member_joined" as const,
      payload: {
        teamId: "team1",
        userId: "user" + Math.floor(Math.random() * 10),
        changes: { role: "member" },
        updatedBy: "user1",
      },
      timestamp: Date.now(),
    })
  }

  get connected(): boolean {
    return this.isConnected
  }
}

// Singleton instance
export const mockWebSocket = new MockWebSocket()
