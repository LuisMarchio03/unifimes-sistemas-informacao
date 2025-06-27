export interface Comment {
  id: string
  documentId: string
  userId: string
  userName: string
  userColor: string
  content: string
  position: {
    start: number
    end: number
  }
  selectedText: string
  type: "comment" | "suggestion"
  status: "active" | "resolved" | "rejected"
  createdAt: number
  updatedAt: number
  replies: CommentReply[]
  mentions: string[]
  isHighlighted: boolean
}

export interface CommentReply {
  id: string
  userId: string
  userName: string
  userColor: string
  content: string
  createdAt: number
  updatedAt: number
  mentions: string[]
}

export interface Suggestion {
  id: string
  documentId: string
  userId: string
  userName: string
  userColor: string
  originalText: string
  suggestedText: string
  position: {
    start: number
    end: number
  }
  reason?: string
  status: "pending" | "accepted" | "rejected"
  createdAt: number
  updatedAt: number
  replies: CommentReply[]
}

export interface CommentThread {
  id: string
  comments: Comment[]
  suggestions: Suggestion[]
  position: {
    start: number
    end: number
  }
  isActive: boolean
  lastActivity: number
}

export interface CommentMessage {
  type:
    | "comment_added"
    | "comment_updated"
    | "comment_resolved"
    | "suggestion_added"
    | "suggestion_accepted"
    | "suggestion_rejected"
    | "reply_added"
  payload: Comment | Suggestion | CommentReply
  documentId: string
  userId: string
  timestamp: number
}
