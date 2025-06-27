import { create } from "zustand"
import type { CollaborativeDocument, CollaborativeSession, TextOperation, CursorPosition, UserCursor } from "./types"
import { OperationalTransform } from "./operational-transform"

interface CollaborativeStore {
  sessions: Record<string, CollaborativeSession>
  currentDocument: CollaborativeDocument | null
  currentSession: CollaborativeSession | null
  pendingOperations: TextOperation[]

  // Actions
  joinDocument: (documentId: string, userId: string, userName: string) => void
  leaveDocument: (documentId: string, userId: string) => void
  applyOperation: (documentId: string, operation: TextOperation) => void
  updateCursor: (
    documentId: string,
    userId: string,
    position: number,
    selection?: { start: number; end: number },
  ) => void
  setCurrentDocument: (document: CollaborativeDocument) => void
  getUserCursors: (documentId: string) => UserCursor[]
  getDocumentContent: (documentId: string) => string
}

const USER_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
]

export const useCollaborativeStore = create<CollaborativeStore>((set, get) => ({
  sessions: {},
  currentDocument: null,
  currentSession: null,
  pendingOperations: [],

  joinDocument: (documentId: string, userId: string, userName: string) => {
    set((state) => {
      const existingSession = state.sessions[documentId]
      const userColor = USER_COLORS[Object.keys(existingSession?.users || {}).length % USER_COLORS.length]

      const session: CollaborativeSession = existingSession || {
        documentId,
        users: {},
        cursors: {},
        operations: [],
        currentVersion: 0,
      }

      session.users[userId] = {
        id: userId,
        name: userName,
        color: userColor,
        isActive: true,
        lastSeen: Date.now(),
      }

      return {
        sessions: {
          ...state.sessions,
          [documentId]: session,
        },
        currentSession: session,
      }
    })
  },

  leaveDocument: (documentId: string, userId: string) => {
    set((state) => {
      const session = state.sessions[documentId]
      if (!session) return state

      const updatedUsers = { ...session.users }
      delete updatedUsers[userId]

      const updatedCursors = { ...session.cursors }
      delete updatedCursors[userId]

      const updatedSession = {
        ...session,
        users: updatedUsers,
        cursors: updatedCursors,
      }

      return {
        sessions: {
          ...state.sessions,
          [documentId]: updatedSession,
        },
        currentSession: state.currentSession?.documentId === documentId ? updatedSession : state.currentSession,
      }
    })
  },

  applyOperation: (documentId: string, operation: TextOperation) => {
    set((state) => {
      const session = state.sessions[documentId]
      if (!session) return state

      // Transform operation against pending operations
      let transformedOp = operation
      for (const pendingOp of state.pendingOperations) {
        transformedOp = OperationalTransform.transform(transformedOp, pendingOp)
      }

      // Apply operation to document content
      if (state.currentDocument && state.currentDocument.id === documentId) {
        const newContent = OperationalTransform.applyOperation(state.currentDocument.content, transformedOp)

        // Transform all cursor positions
        const updatedCursors: Record<string, CursorPosition> = {}
        Object.entries(session.cursors).forEach(([userId, cursor]) => {
          updatedCursors[userId] = {
            ...cursor,
            position: OperationalTransform.transformCursor(cursor.position, transformedOp),
            selection: cursor.selection
              ? {
                  start: OperationalTransform.transformCursor(cursor.selection.start, transformedOp),
                  end: OperationalTransform.transformCursor(cursor.selection.end, transformedOp),
                }
              : undefined,
          }
        })

        const updatedSession = {
          ...session,
          operations: [...session.operations, transformedOp],
          currentVersion: session.currentVersion + 1,
          cursors: updatedCursors,
        }

        return {
          sessions: {
            ...state.sessions,
            [documentId]: updatedSession,
          },
          currentSession: updatedSession,
          currentDocument: {
            ...state.currentDocument,
            content: newContent,
            version: state.currentDocument.version + 1,
            lastModified: Date.now(),
          },
        }
      }

      return state
    })
  },

  updateCursor: (documentId: string, userId: string, position: number, selection?: { start: number; end: number }) => {
    set((state) => {
      const session = state.sessions[documentId]
      if (!session) return state

      const updatedSession = {
        ...session,
        cursors: {
          ...session.cursors,
          [userId]: {
            userId,
            position,
            selection,
            timestamp: Date.now(),
          },
        },
      }

      return {
        sessions: {
          ...state.sessions,
          [documentId]: updatedSession,
        },
        currentSession: state.currentSession?.documentId === documentId ? updatedSession : state.currentSession,
      }
    })
  },

  setCurrentDocument: (document: CollaborativeDocument) => {
    set({ currentDocument: document })
  },

  getUserCursors: (documentId: string): UserCursor[] => {
    const state = get()
    const session = state.sessions[documentId]
    if (!session) return []

    return Object.entries(session.cursors)
      .filter(([userId]) => userId !== "current_user") // Exclude current user's cursor
      .map(([userId, cursor]) => ({
        userId,
        userName: session.users[userId]?.name || "Unknown",
        color: session.users[userId]?.color || "#666",
        position: cursor.position,
        selection: cursor.selection,
        isActive: session.users[userId]?.isActive || false,
      }))
  },

  getDocumentContent: (documentId: string): string => {
    const state = get()
    return state.currentDocument?.content || ""
  },
}))
