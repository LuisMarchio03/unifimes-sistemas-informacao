import { create } from "zustand"
import type { Comment, Suggestion, CommentReply, CommentThread } from "./comment-types"

interface CommentStore {
  comments: Record<string, Comment>
  suggestions: Record<string, Suggestion>
  threads: Record<string, CommentThread>
  activeThread: string | null
  selectedRange: { start: number; end: number; text: string } | null
  showResolved: boolean

  // Actions
  addComment: (
    documentId: string,
    userId: string,
    userName: string,
    content: string,
    position: { start: number; end: number },
    selectedText: string,
  ) => Comment
  addSuggestion: (
    documentId: string,
    userId: string,
    userName: string,
    originalText: string,
    suggestedText: string,
    position: { start: number; end: number },
    reason?: string,
  ) => Suggestion
  addReply: (commentId: string, userId: string, userName: string, content: string) => CommentReply
  resolveComment: (commentId: string) => void
  acceptSuggestion: (suggestionId: string) => void
  rejectSuggestion: (suggestionId: string) => void
  setActiveThread: (threadId: string | null) => void
  setSelectedRange: (range: { start: number; end: number; text: string } | null) => void
  getCommentsForRange: (start: number, end: number) => Comment[]
  getSuggestionsForRange: (start: number, end: number) => Suggestion[]
  getThreadsForDocument: (documentId: string) => CommentThread[]
  toggleShowResolved: () => void
  updateCommentPositions: (offset: number, length: number, isInsert: boolean) => void
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

export const useCommentStore = create<CommentStore>((set, get) => ({
  comments: {},
  suggestions: {},
  threads: {},
  activeThread: null,
  selectedRange: null,
  showResolved: false,

  addComment: (documentId, userId, userName, content, position, selectedText) => {
    const comment: Comment = {
      id: crypto.randomUUID(),
      documentId,
      userId,
      userName,
      userColor: USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)],
      content,
      position,
      selectedText,
      type: "comment",
      status: "active",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      replies: [],
      mentions: extractMentions(content),
      isHighlighted: false,
    }

    set((state) => {
      const threadId = `thread_${position.start}_${position.end}`
      const existingThread = state.threads[threadId]

      const thread: CommentThread = existingThread || {
        id: threadId,
        comments: [],
        suggestions: [],
        position,
        isActive: true,
        lastActivity: Date.now(),
      }

      thread.comments.push(comment)
      thread.lastActivity = Date.now()

      return {
        comments: { ...state.comments, [comment.id]: comment },
        threads: { ...state.threads, [threadId]: thread },
        activeThread: threadId,
      }
    })

    return comment
  },

  addSuggestion: (documentId, userId, userName, originalText, suggestedText, position, reason) => {
    const suggestion: Suggestion = {
      id: crypto.randomUUID(),
      documentId,
      userId,
      userName,
      userColor: USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)],
      originalText,
      suggestedText,
      position,
      reason,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      replies: [],
    }

    set((state) => {
      const threadId = `thread_${position.start}_${position.end}`
      const existingThread = state.threads[threadId]

      const thread: CommentThread = existingThread || {
        id: threadId,
        comments: [],
        suggestions: [],
        position,
        isActive: true,
        lastActivity: Date.now(),
      }

      thread.suggestions.push(suggestion)
      thread.lastActivity = Date.now()

      return {
        suggestions: { ...state.suggestions, [suggestion.id]: suggestion },
        threads: { ...state.threads, [threadId]: thread },
        activeThread: threadId,
      }
    })

    return suggestion
  },

  addReply: (commentId, userId, userName, content) => {
    const reply: CommentReply = {
      id: crypto.randomUUID(),
      userId,
      userName,
      userColor: USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)],
      content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      mentions: extractMentions(content),
    }

    set((state) => {
      const comment = state.comments[commentId]
      if (comment) {
        const updatedComment = {
          ...comment,
          replies: [...comment.replies, reply],
          updatedAt: Date.now(),
        }

        // Update thread activity
        const thread = Object.values(state.threads).find((t) => t.comments.some((c) => c.id === commentId))
        if (thread) {
          thread.lastActivity = Date.now()
        }

        return {
          comments: { ...state.comments, [commentId]: updatedComment },
        }
      }
      return state
    })

    return reply
  },

  resolveComment: (commentId) => {
    set((state) => {
      const comment = state.comments[commentId]
      if (comment) {
        const updatedComment = {
          ...comment,
          status: "resolved" as const,
          updatedAt: Date.now(),
        }

        return {
          comments: { ...state.comments, [commentId]: updatedComment },
        }
      }
      return state
    })
  },

  acceptSuggestion: (suggestionId) => {
    set((state) => {
      const suggestion = state.suggestions[suggestionId]
      if (suggestion) {
        const updatedSuggestion = {
          ...suggestion,
          status: "accepted" as const,
          updatedAt: Date.now(),
        }

        return {
          suggestions: { ...state.suggestions, [suggestionId]: updatedSuggestion },
        }
      }
      return state
    })
  },

  rejectSuggestion: (suggestionId) => {
    set((state) => {
      const suggestion = state.suggestions[suggestionId]
      if (suggestion) {
        const updatedSuggestion = {
          ...suggestion,
          status: "rejected" as const,
          updatedAt: Date.now(),
        }

        return {
          suggestions: { ...state.suggestions, [suggestionId]: updatedSuggestion },
        }
      }
      return state
    })
  },

  setActiveThread: (threadId) => {
    set({ activeThread: threadId })
  },

  setSelectedRange: (range) => {
    set({ selectedRange: range })
  },

  getCommentsForRange: (start, end) => {
    const state = get()
    return Object.values(state.comments).filter(
      (comment) => comment.position.start >= start && comment.position.end <= end,
    )
  },

  getSuggestionsForRange: (start, end) => {
    const state = get()
    return Object.values(state.suggestions).filter(
      (suggestion) => suggestion.position.start >= start && suggestion.position.end <= end,
    )
  },

  getThreadsForDocument: (documentId) => {
    const state = get()
    return Object.values(state.threads)
      .filter((thread) => {
        const hasComments = thread.comments.some((c) => c.documentId === documentId)
        const hasSuggestions = thread.suggestions.some((s) => s.documentId === documentId)
        return hasComments || hasSuggestions
      })
      .sort((a, b) => b.lastActivity - a.lastActivity)
  },

  toggleShowResolved: () => {
    set((state) => ({ showResolved: !state.showResolved }))
  },

  updateCommentPositions: (offset, length, isInsert) => {
    set((state) => {
      const updatedComments = { ...state.comments }
      const updatedSuggestions = { ...state.suggestions }
      const updatedThreads = { ...state.threads }

      // Update comment positions
      Object.values(updatedComments).forEach((comment) => {
        if (comment.position.start >= offset) {
          comment.position.start += isInsert ? length : -length
          comment.position.end += isInsert ? length : -length
        } else if (comment.position.end > offset) {
          comment.position.end += isInsert ? length : -length
        }
      })

      // Update suggestion positions
      Object.values(updatedSuggestions).forEach((suggestion) => {
        if (suggestion.position.start >= offset) {
          suggestion.position.start += isInsert ? length : -length
          suggestion.position.end += isInsert ? length : -length
        } else if (suggestion.position.end > offset) {
          suggestion.position.end += isInsert ? length : -length
        }
      })

      // Update thread positions
      Object.values(updatedThreads).forEach((thread) => {
        if (thread.position.start >= offset) {
          thread.position.start += isInsert ? length : -length
          thread.position.end += isInsert ? length : -length
        } else if (thread.position.end > offset) {
          thread.position.end += isInsert ? length : -length
        }
      })

      return {
        comments: updatedComments,
        suggestions: updatedSuggestions,
        threads: updatedThreads,
      }
    })
  },
}))

function extractMentions(content: string): string[] {
  const mentionRegex = /@(\w+)/g
  const mentions: string[] = []
  let match

  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push(match[1])
  }

  return mentions
}
