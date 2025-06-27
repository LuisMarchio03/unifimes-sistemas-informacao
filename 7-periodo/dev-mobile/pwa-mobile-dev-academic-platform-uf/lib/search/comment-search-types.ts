export interface CommentSearchResult {
  id: string
  type: "comment" | "suggestion" | "reply"
  documentId: string
  documentTitle: string
  content: string
  author: string
  authorColor: string
  createdAt: number
  updatedAt: number
  status: string
  position: {
    start: number
    end: number
  }
  selectedText?: string
  parentId?: string // For replies
  matchedText: string
  matchScore: number
  context: {
    before: string
    after: string
  }
}

export interface SearchFilters {
  query: string
  documentIds: string[]
  authors: string[]
  types: ("comment" | "suggestion" | "reply")[]
  statuses: string[]
  dateRange: {
    start: Date | null
    end: Date | null
  }
  sortBy: "relevance" | "date" | "author" | "document"
  sortOrder: "asc" | "desc"
}

export interface SearchStats {
  totalResults: number
  commentCount: number
  suggestionCount: number
  replyCount: number
  documentCount: number
  authorCount: number
}

export interface DocumentSearchInfo {
  id: string
  title: string
  resultCount: number
  lastActivity: number
}
