"use client"

import type React from "react"

import { useRef, useEffect, useState, useCallback } from "react"
import { CollaborativeEditor } from "./collaborative-editor"
import { CommentSidebar } from "./comment-sidebar"
import { CommentHighlights } from "./comment-highlights"
import { useCommentStore } from "@/lib/collaborative/comment-store"
import { useCollaborativeEditor } from "@/lib/hooks/use-collaborative-editor"
import { Button } from "@/components/ui/button"
import { MessageSquare, X } from "lucide-react"

interface CollaborativeEditorWithCommentsProps {
  documentId: string
  userId?: string
  userName?: string
  className?: string
}

export function CollaborativeEditorWithComments({
  documentId,
  userId = "current_user",
  userName = "Current User",
  className = "",
}: CollaborativeEditorWithCommentsProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [showComments, setShowComments] = useState(true)
  const [isSelecting, setIsSelecting] = useState(false)

  const { setSelectedRange, selectedRange, updateCommentPositions } = useCommentStore()
  const { content, insertText, deleteText } = useCollaborativeEditor(documentId, userId, userName)

  // Handle text selection for comments
  const handleSelectionChange = useCallback(() => {
    if (!textareaRef.current) return

    const start = textareaRef.current.selectionStart
    const end = textareaRef.current.selectionEnd

    if (start !== end) {
      const selectedText = content.substring(start, end)
      setSelectedRange({ start, end, text: selectedText })
      setIsSelecting(true)
    } else {
      if (!isSelecting) {
        setSelectedRange(null)
      }
    }
  }, [content, setSelectedRange, isSelecting])

  // Update comment positions when text changes
  useEffect(() => {
    // This would be called when operations are applied
    // For now, we'll simulate it with content changes
  }, [content, updateCommentPositions])

  // Clear selection when clicking outside
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (textareaRef.current && !textareaRef.current.contains(e.target as Node)) {
        setIsSelecting(false)
        if (!selectedRange) {
          setSelectedRange(null)
        }
      }
    },
    [selectedRange, setSelectedRange],
  )

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [handleClickOutside])

  return (
    <div className={`flex h-full ${className}`}>
      {/* Main editor area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b border-white/10 bg-white/5 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-white">Editor Colaborativo</h2>
              {selectedRange && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>•</span>
                  <span>Texto selecionado ({selectedRange.end - selectedRange.start} caracteres)</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {selectedRange && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedRange(null)
                    setIsSelecting(false)
                  }}
                  className="text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Limpar seleção
                </Button>
              )}

              <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)} className="text-xs">
                <MessageSquare className="h-4 w-4 mr-1" />
                {showComments ? "Ocultar" : "Mostrar"} Comentários
              </Button>
            </div>
          </div>
        </div>

        {/* Editor with highlights */}
        <div className="flex-1 relative">
          <div className="absolute inset-0">
            <CollaborativeEditor documentId={documentId} userId={userId} userName={userName} className="h-full" />
          </div>

          {/* Comment highlights overlay */}
          <CommentHighlights documentId={documentId} content={content} textareaRef={textareaRef} />
        </div>
      </div>

      {/* Comments sidebar */}
      {showComments && <CommentSidebar documentId={documentId} userId={userId} userName={userName} />}
    </div>
  )
}

// Update the original collaborative editor to expose textarea ref
declare module "./collaborative-editor" {
  interface CollaborativeEditorProps {
    textareaRef?: React.RefObject<HTMLTextAreaElement>
  }
}
