"use client"

import type React from "react"

import { useRef, useEffect, useState, useCallback } from "react"
import { useCollaborativeEditor } from "@/lib/hooks/use-collaborative-editor"
import type { UserCursor } from "@/lib/collaborative/types"
import { Users, Eye, Edit3 } from "lucide-react"

// Add textareaRef prop to the CollaborativeEditorProps interface
interface CollaborativeEditorProps {
  documentId: string
  userId?: string
  userName?: string
  className?: string
  textareaRef?: React.RefObject<HTMLTextAreaElement>
}

// Update the component to use the passed ref or create its own
export function CollaborativeEditor({
  documentId,
  userId = "current_user",
  userName = "Current User",
  className = "",
  textareaRef: externalRef,
}: CollaborativeEditorProps) {
  const internalRef = useRef<HTMLTextAreaElement>(null)
  const textareaRef = externalRef || internalRef

  const [localContent, setLocalContent] = useState("")
  const [cursorPosition, setCursorPosition] = useState(0)

  const { content, cursors, collaborators, insertText, deleteText, setCursor } = useCollaborativeEditor(
    documentId,
    userId,
    userName,
  )

  // Sync content with collaborative store
  useEffect(() => {
    if (content !== localContent) {
      setLocalContent(content)
    }
  }, [content])

  // Handle text changes
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = e.target.value
      const textarea = e.target
      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      // Calculate the difference
      const oldContent = localContent
      const commonStart = findCommonStart(oldContent, newContent)
      const commonEnd = findCommonEnd(oldContent, newContent)

      if (newContent.length > oldContent.length) {
        // Text was inserted
        const insertedText = newContent.slice(commonStart, newContent.length - commonEnd)
        insertText(commonStart, insertedText)
      } else if (newContent.length < oldContent.length) {
        // Text was deleted
        const deletedLength = oldContent.length - newContent.length
        deleteText(commonStart, deletedLength)
      }

      setLocalContent(newContent)
      setCursorPosition(start)
      setCursor(start, start !== end ? { start, end } : undefined)
    },
    [localContent, insertText, deleteText, setCursor],
  )

  // Handle cursor position changes
  const handleSelectionChange = useCallback(() => {
    if (!textareaRef.current) return

    const start = textareaRef.current.selectionStart
    const end = textareaRef.current.selectionEnd

    setCursorPosition(start)
    setCursor(start, start !== end ? { start, end } : undefined)
  }, [setCursor])

  // Render cursor overlays
  const renderCursors = () => {
    if (!textareaRef.current) return null

    return cursors.map((cursor) => (
      <CursorOverlay key={cursor.userId} cursor={cursor} textareaRef={textareaRef} content={localContent} />
    ))
  }

  return (
    <div className={`relative ${className}`}>
      {/* Collaborators bar */}
      <div className="mb-4 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="text-sm font-medium">Colaboradores</span>
          <span className="text-xs text-gray-400">({collaborators.length})</span>
        </div>
        <div className="flex items-center gap-2">
          {collaborators.slice(0, 5).map((collaborator) => (
            <div
              key={collaborator.id}
              className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1"
              title={collaborator.name}
            >
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: collaborator.color }} />
              <span className="text-xs">{collaborator.name}</span>
              {collaborator.isActive ? (
                <Edit3 className="h-3 w-3 text-green-500" />
              ) : (
                <Eye className="h-3 w-3 text-gray-500" />
              )}
            </div>
          ))}
          {collaborators.length > 5 && <span className="text-xs text-gray-400">+{collaborators.length - 5} mais</span>}
        </div>
      </div>

      {/* Editor container */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={localContent}
          onChange={handleTextChange}
          onSelect={handleSelectionChange}
          onKeyUp={handleSelectionChange}
          onMouseUp={handleSelectionChange}
          className="min-h-[400px] w-full resize-none rounded-lg border border-white/10 bg-black/80 p-4 font-mono text-sm leading-relaxed text-white placeholder:text-gray-400 focus:border-white/20 focus:outline-none"
          placeholder="Comece a digitar..."
          spellCheck={false}
        />

        {/* Cursor overlays */}
        <div className="pointer-events-none absolute inset-0">{renderCursors()}</div>
      </div>

      {/* Status bar */}
      <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <span>Posição: {cursorPosition}</span>
          <span>Caracteres: {localContent.length}</span>
          <span>Linhas: {localContent.split("\n").length}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span>Sincronizado</span>
        </div>
      </div>
    </div>
  )
}

// Helper component for rendering user cursors
function CursorOverlay({
  cursor,
  textareaRef,
  content,
}: {
  cursor: UserCursor
  textareaRef: React.RefObject<HTMLTextAreaElement>
  content: string
}) {
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const { top, left } = getCaretCoordinates(textarea, cursor.position, content)

    setPosition({ top, left })
  }, [cursor.position, content, textareaRef])

  return (
    <div
      className="absolute z-10"
      style={{
        top: position.top + 4,
        left: position.left + 4,
      }}
    >
      {/* Cursor line */}
      <div className="absolute h-5 w-0.5 animate-pulse" style={{ backgroundColor: cursor.color }} />

      {/* User label */}
      <div
        className="absolute -top-6 left-0 rounded px-1 py-0.5 text-xs text-white whitespace-nowrap"
        style={{ backgroundColor: cursor.color }}
      >
        {cursor.userName}
      </div>

      {/* Selection highlight */}
      {cursor.selection && cursor.selection.start !== cursor.selection.end && (
        <div
          className="absolute opacity-30"
          style={{
            backgroundColor: cursor.color,
            // This would need more complex calculation for multi-line selections
          }}
        />
      )}
    </div>
  )
}

// Helper functions
function findCommonStart(str1: string, str2: string): number {
  let i = 0
  while (i < str1.length && i < str2.length && str1[i] === str2[i]) {
    i++
  }
  return i
}

function findCommonEnd(str1: string, str2: string): number {
  let i = 0
  while (i < str1.length && i < str2.length && str1[str1.length - 1 - i] === str2[str2.length - 1 - i]) {
    i++
  }
  return i
}

function getCaretCoordinates(
  textarea: HTMLTextAreaElement,
  position: number,
  content: string,
): { top: number; left: number } {
  // Create a mirror div to calculate position
  const div = document.createElement("div")
  const style = getComputedStyle(textarea)

  // Copy styles
  div.style.position = "absolute"
  div.style.visibility = "hidden"
  div.style.whiteSpace = "pre-wrap"
  div.style.wordWrap = "break-word"
  div.style.font = style.font
  div.style.padding = style.padding
  div.style.border = style.border
  div.style.width = style.width
  div.style.height = style.height

  document.body.appendChild(div)

  // Set content up to cursor position
  div.textContent = content.substring(0, position)

  // Add a span to measure cursor position
  const span = document.createElement("span")
  span.textContent = "|"
  div.appendChild(span)

  const rect = span.getBoundingClientRect()
  const textareaRect = textarea.getBoundingClientRect()

  document.body.removeChild(div)

  return {
    top: rect.top - textareaRect.top + textarea.scrollTop,
    left: rect.left - textareaRect.left + textarea.scrollLeft,
  }
}
