"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useCommentStore } from "@/lib/collaborative/comment-store"

interface CommentHighlightsProps {
  documentId: string
  content: string
  textareaRef: React.RefObject<HTMLTextAreaElement>
}

export function CommentHighlights({ documentId, content, textareaRef }: CommentHighlightsProps) {
  const { threads, activeThread, setActiveThread } = useCommentStore()
  const [highlights, setHighlights] = useState<
    Array<{
      id: string
      start: number
      end: number
      type: "comment" | "suggestion"
      status: string
      color: string
      isActive: boolean
    }>
  >([])

  useEffect(() => {
    const documentThreads = Object.values(threads).filter((thread) => {
      const hasComments = thread.comments.some((c) => c.documentId === documentId)
      const hasSuggestions = thread.suggestions.some((s) => s.documentId === documentId)
      return hasComments || hasSuggestions
    })

    const newHighlights: typeof highlights = []

    documentThreads.forEach((thread) => {
      // Add comment highlights
      thread.comments.forEach((comment) => {
        if (comment.status === "active") {
          newHighlights.push({
            id: comment.id,
            start: comment.position.start,
            end: comment.position.end,
            type: "comment",
            status: comment.status,
            color: comment.userColor,
            isActive: activeThread === thread.id,
          })
        }
      })

      // Add suggestion highlights
      thread.suggestions.forEach((suggestion) => {
        if (suggestion.status === "pending") {
          newHighlights.push({
            id: suggestion.id,
            start: suggestion.position.start,
            end: suggestion.position.end,
            type: "suggestion",
            status: suggestion.status,
            color: suggestion.userColor,
            isActive: activeThread === thread.id,
          })
        }
      })
    })

    // Sort by position to handle overlapping highlights
    newHighlights.sort((a, b) => a.start - b.start)
    setHighlights(newHighlights)
  }, [threads, documentId, activeThread])

  const renderHighlights = () => {
    if (!textareaRef.current || highlights.length === 0) return null

    return highlights.map((highlight) => {
      const { top, left, width, height } = getTextPosition(
        textareaRef.current!,
        highlight.start,
        highlight.end,
        content,
      )

      return (
        <div
          key={highlight.id}
          className={`absolute cursor-pointer transition-all duration-200 ${
            highlight.isActive ? "ring-2 ring-white/50" : "hover:ring-1 hover:ring-white/30"
          }`}
          style={{
            top: top + 4,
            left: left + 4,
            width,
            height,
            backgroundColor: highlight.type === "comment" ? `${highlight.color}40` : `${highlight.color}30`,
            borderLeft: `3px solid ${highlight.color}`,
          }}
          onClick={() => {
            const thread = Object.values(threads).find(
              (t) => t.comments.some((c) => c.id === highlight.id) || t.suggestions.some((s) => s.id === highlight.id),
            )
            if (thread) {
              setActiveThread(thread.id)
            }
          }}
          title={highlight.type === "comment" ? "Clique para ver comentário" : "Clique para ver sugestão"}
        />
      )
    })
  }

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="pointer-events-auto relative">{renderHighlights()}</div>
    </div>
  )
}

function getTextPosition(
  textarea: HTMLTextAreaElement,
  start: number,
  end: number,
  content: string,
): { top: number; left: number; width: number; height: number } {
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
  div.style.lineHeight = style.lineHeight

  document.body.appendChild(div)

  // Set content up to start position
  div.textContent = content.substring(0, start)

  // Add a span for the start position
  const startSpan = document.createElement("span")
  startSpan.textContent = content.substring(start, end) || "|"
  div.appendChild(startSpan)

  const startRect = startSpan.getBoundingClientRect()
  const textareaRect = textarea.getBoundingClientRect()

  // Calculate dimensions
  const top = startRect.top - textareaRect.top + textarea.scrollTop
  const left = startRect.left - textareaRect.left + textarea.scrollLeft
  const width = Math.max(startRect.width, 2) // Minimum width for visibility
  const height = startRect.height

  document.body.removeChild(div)

  return { top, left, width, height }
}
