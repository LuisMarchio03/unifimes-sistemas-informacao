export interface CollaborativeDocument {
  id: string
  title: string
  content: string
  version: number
  lastModified: number
  collaborators: string[]
  permissions: Record<string, "read" | "write" | "admin">
}

export interface TextOperation {
  id: string
  type: "insert" | "delete" | "retain"
  position: number
  content?: string
  length?: number
  userId: string
  timestamp: number
  version: number
}

export interface CursorPosition {
  userId: string
  position: number
  selection?: {
    start: number
    end: number
  }
  timestamp: number
}

export interface UserCursor {
  userId: string
  userName: string
  color: string
  position: number
  selection?: {
    start: number
    end: number
  }
  isActive: boolean
}

export interface CollaborativeSession {
  documentId: string
  users: Record<
    string,
    {
      id: string
      name: string
      color: string
      isActive: boolean
      lastSeen: number
    }
  >
  cursors: Record<string, CursorPosition>
  operations: TextOperation[]
  currentVersion: number
}

export interface CollaborativeMessage {
  id: string
  type: "operation" | "cursor" | "user_joined" | "user_left" | "document_updated"
  payload: any
  documentId: string
  userId: string
  timestamp: number
}
