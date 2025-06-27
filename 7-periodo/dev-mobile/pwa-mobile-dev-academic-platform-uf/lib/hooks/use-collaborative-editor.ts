"use client"

import { useEffect, useCallback, useRef } from "react"
import { useCollaborativeStore } from "../collaborative/collaborative-store"
import { useWebSocketStore } from "../websocket/websocket-store"
import type { TextOperation, CollaborativeMessage } from "../collaborative/types"

export function useCollaborativeEditor(documentId: string, userId = "current_user", userName = "Current User") {
  const {
    joinDocument,
    leaveDocument,
    applyOperation,
    updateCursor,
    setCurrentDocument,
    getUserCursors,
    getDocumentContent,
    currentDocument,
    currentSession,
  } = useCollaborativeStore()

  const { sendMessage } = useWebSocketStore()
  const operationQueue = useRef<TextOperation[]>([])
  const isApplyingRemoteOperation = useRef(false)

  // Join document session
  useEffect(() => {
    joinDocument(documentId, userId, userName)

    // Set mock document
    setCurrentDocument({
      id: documentId,
      title: "Collaborative Document",
      content:
        "# Documento Colaborativo\n\nEste é um documento que pode ser editado em tempo real por múltiplos usuários.\n\nComece a digitar para ver a colaboração em ação!",
      version: 1,
      lastModified: Date.now(),
      collaborators: [userId],
      permissions: { [userId]: "write" },
    })

    return () => {
      leaveDocument(documentId, userId)
    }
  }, [documentId, userId, userName, joinDocument, leaveDocument, setCurrentDocument])

  // Listen for collaborative messages
  useEffect(() => {
    const unsubscribe = useWebSocketStore.subscribe(
      (state) => state.messages,
      (messages) => {
        const collaborativeMessages = messages.filter(
          (msg): msg is CollaborativeMessage =>
            msg.type.startsWith("collaborative_") && (msg as any).documentId === documentId,
        )

        collaborativeMessages.forEach((message) => {
          if (message.userId === userId) return // Ignore own messages

          switch (message.type) {
            case "collaborative_operation":
              if (!isApplyingRemoteOperation.current) {
                applyOperation(documentId, message.payload)
              }
              break
            case "collaborative_cursor":
              updateCursor(documentId, message.userId, message.payload.position, message.payload.selection)
              break
          }
        })
      },
    )

    return unsubscribe
  }, [documentId, userId, applyOperation, updateCursor])

  const insertText = useCallback(
    (position: number, text: string) => {
      if (!currentDocument) return

      const operation: TextOperation = {
        id: crypto.randomUUID(),
        type: "insert",
        position,
        content: text,
        userId,
        timestamp: Date.now(),
        version: currentDocument.version,
      }

      // Apply locally first
      isApplyingRemoteOperation.current = true
      applyOperation(documentId, operation)
      isApplyingRemoteOperation.current = false

      // Send to other users
      sendMessage({
        type: "collaborative_operation",
        payload: operation,
        documentId,
        userId,
      } as any)
    },
    [currentDocument, documentId, userId, applyOperation, sendMessage],
  )

  const deleteText = useCallback(
    (position: number, length: number) => {
      if (!currentDocument) return

      const operation: TextOperation = {
        id: crypto.randomUUID(),
        type: "delete",
        position,
        length,
        userId,
        timestamp: Date.now(),
        version: currentDocument.version,
      }

      // Apply locally first
      isApplyingRemoteOperation.current = true
      applyOperation(documentId, operation)
      isApplyingRemoteOperation.current = false

      // Send to other users
      sendMessage({
        type: "collaborative_operation",
        payload: operation,
        documentId,
        userId,
      } as any)
    },
    [currentDocument, documentId, userId, applyOperation, sendMessage],
  )

  const setCursor = useCallback(
    (position: number, selection?: { start: number; end: number }) => {
      updateCursor(documentId, userId, position, selection)

      // Send cursor position to other users
      sendMessage({
        type: "collaborative_cursor",
        payload: { position, selection },
        documentId,
        userId,
      } as any)
    },
    [documentId, userId, updateCursor, sendMessage],
  )

  const content = getDocumentContent(documentId)
  const cursors = getUserCursors(documentId)
  const collaborators = currentSession?.users ? Object.values(currentSession.users) : []

  return {
    content,
    cursors,
    collaborators,
    insertText,
    deleteText,
    setCursor,
    document: currentDocument,
    session: currentSession,
  }
}
