import { Task } from "../types/task"
import { TaskUpdateMessage, TaskUpdateType } from "../types/websocket"

export interface WebSocketMessage {
  id: string
  type: string
  payload: any
  timestamp: number
  userId?: string
  roomId?: string
}

export interface TeamUpdateMessage extends WebSocketMessage {
  type: "team_member_joined" | "team_member_left" | "team_updated"
  payload: {
    teamId: string
    userId?: string
    changes: any
    updatedBy: string
  }
}

export interface ProjectUpdateMessage extends WebSocketMessage {
  type: "project_updated" | "project_status_changed"
  payload: {
    projectId: string
    changes: any
    updatedBy: string
  }
}

export interface NotificationMessage extends WebSocketMessage {
  type: "notification"
  payload: {
    title: string
    message: string
    severity: "info" | "success" | "warning" | "error"
    actionUrl?: string
  }
}

export interface UserPresenceMessage extends WebSocketMessage {
  type: "user_online" | "user_offline" | "user_typing"
  payload: {
    userId: string
    status: "online" | "offline" | "away"
    lastSeen?: number
    context?: string
  }
}

export interface WSTaskUpdateMessage extends WebSocketMessage {
  type: TaskUpdateType
  payload: {
    taskId: string
    projectId: string
    changes: Partial<Task>
    updatedBy: string
  }
}

export interface RoomJoinedMessage extends WebSocketMessage {
  type: "room_joined"
  payload: {
    roomId: string
  }
}

export interface RoomLeftMessage extends WebSocketMessage {
  type: "room_left"
  payload: {
    roomId: string
  }
}

export interface ConnectionMessage extends WebSocketMessage {
  type: "connection" | "disconnection" | "heartbeat"
  payload: {
    status?: string
    timestamp?: number
  }
}

// Tipo de mensagem genérico que engloba qualquer mensagem válida
export type WSMessage = 
  | WebSocketMessage  // Tipo base, aceita qualquer mensagem válida
  | WSTaskUpdateMessage
  | TeamUpdateMessage
  | ProjectUpdateMessage
  | NotificationMessage
  | UserPresenceMessage
  | RoomJoinedMessage
  | RoomLeftMessage
  | ConnectionMessage

export interface WebSocketStore {
  isConnected: boolean
  messages: WSMessage[]
  userPresence: Record<string, UserPresenceMessage["payload"]>
  connect: () => Promise<void>
  disconnect: () => void
  sendMessage: (message: Omit<TaskUpdateMessage, "id" | "timestamp">) => void
  subscribeToRoom: (roomId: string) => void
  unsubscribeFromRoom: (roomId: string) => void
  clearMessages: () => void
}
