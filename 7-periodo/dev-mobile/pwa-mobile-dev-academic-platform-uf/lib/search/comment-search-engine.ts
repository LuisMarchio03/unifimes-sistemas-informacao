import type { Comment, Suggestion, CommentReply } from "@/lib/collaborative/comment-types"
import type { CommentSearchResult, SearchFilters, SearchStats, DocumentSearchInfo } from "./comment-search-types"

export class CommentSearchEngine {
  private documents: Record<string, { title: string; content: string }> = {}
  private comments: Record<string, Comment> = {}
  private suggestions: Record<string, Suggestion> = {}

  // Mock document data
  constructor() {
    this.documents = {
      "doc-1": { title: "Projeto de Pesquisa - IA na Educação", content: "Conteúdo do documento..." },
      "doc-2": { title: "Relatório de Progresso Q1", content: "Relatório trimestral..." },
      "doc-3": { title: "Proposta de Metodologia", content: "Metodologia de pesquisa..." },
      "doc-4": { title: "Análise de Dados Preliminar", content: "Análise dos dados coletados..." },
      "doc-5": { title: "Revisão da Literatura", content: "Estado da arte em IA educacional..." },
    }
  }

  updateData(comments: Record<string, Comment>, suggestions: Record<string, Suggestion>) {
    this.comments = comments
    this.suggestions = suggestions
  }

  search(filters: SearchFilters): {
    results: CommentSearchResult[]
    stats: SearchStats
    documents: DocumentSearchInfo[]
  } {
    const allResults: CommentSearchResult[] = []

    // Search through comments
    Object.values(this.comments).forEach((comment) => {
      if (this.matchesFilters(comment, filters, "comment")) {
        const result = this.createSearchResult(comment, filters.query, "comment")
        if (result) allResults.push(result)

        // Search through replies
        comment.replies.forEach((reply) => {
          if (this.matchesFilters(reply, filters, "reply", comment)) {
            const replyResult = this.createSearchResult(reply, filters.query, "reply", comment)
            if (replyResult) allResults.push(replyResult)
          }
        })
      }
    })

    // Search through suggestions
    Object.values(this.suggestions).forEach((suggestion) => {
      if (this.matchesFilters(suggestion, filters, "suggestion")) {
        const result = this.createSearchResult(suggestion, filters.query, "suggestion")
        if (result) allResults.push(result)

        // Search through suggestion replies
        suggestion.replies.forEach((reply) => {
          if (this.matchesFilters(reply, filters, "reply", suggestion)) {
            const replyResult = this.createSearchResult(reply, filters.query, "reply", suggestion)
            if (replyResult) allResults.push(replyResult)
          }
        })
      }
    })

    // Sort results
    const sortedResults = this.sortResults(allResults, filters.sortBy, filters.sortOrder)

    // Calculate stats
    const stats = this.calculateStats(sortedResults)

    // Get document info
    const documents = this.getDocumentInfo(sortedResults)

    return { results: sortedResults, stats, documents }
  }

  private matchesFilters(
    item: Comment | Suggestion | CommentReply,
    filters: SearchFilters,
    type: "comment" | "suggestion" | "reply",
    parent?: Comment | Suggestion,
  ): boolean {
    // Type filter
    if (filters.types.length > 0 && !filters.types.includes(type)) {
      return false
    }

    // Document filter
    const documentId = "documentId" in item ? item.documentId : parent?.documentId
    if (filters.documentIds.length > 0 && documentId && !filters.documentIds.includes(documentId)) {
      return false
    }

    // Author filter
    if (filters.authors.length > 0 && !filters.authors.includes(item.userName)) {
      return false
    }

    // Status filter
    if (filters.statuses.length > 0) {
      const status = "status" in item ? item.status : "active"
      if (!filters.statuses.includes(status)) {
        return false
      }
    }

    // Date range filter
    if (filters.dateRange.start && item.createdAt < filters.dateRange.start.getTime()) {
      return false
    }
    if (filters.dateRange.end && item.createdAt > filters.dateRange.end.getTime()) {
      return false
    }

    // Query filter
    if (filters.query.trim()) {
      const searchableText = this.getSearchableText(item, type, parent)
      return this.matchesQuery(searchableText, filters.query)
    }

    return true
  }

  private getSearchableText(
    item: Comment | Suggestion | CommentReply,
    type: "comment" | "suggestion" | "reply",
    parent?: Comment | Suggestion,
  ): string {
    let text = ""

    if (type === "comment" && "content" in item) {
      text += item.content + " "
      if ("selectedText" in item && item.selectedText) {
        text += item.selectedText + " "
      }
    } else if (type === "suggestion" && "suggestedText" in item) {
      text += item.suggestedText + " " + item.originalText + " "
      if (item.reason) {
        text += item.reason + " "
      }
    } else if (type === "reply") {
      text += item.content + " "
    }

    text += item.userName + " "

    return text.toLowerCase()
  }

  private matchesQuery(text: string, query: string): boolean {
    const queryLower = query.toLowerCase()
    const terms = queryLower.split(/\s+/).filter(Boolean)

    // Support for exact phrases in quotes
    const phraseMatches = query.match(/"([^"]+)"/g)
    if (phraseMatches) {
      return phraseMatches.every((phrase) => {
        const cleanPhrase = phrase.replace(/"/g, "").toLowerCase()
        return text.includes(cleanPhrase)
      })
    }

    // Support for AND/OR operators
    if (query.includes(" AND ")) {
      const andTerms = queryLower.split(" AND ").map((t) => t.trim())
      return andTerms.every((term) => text.includes(term))
    }

    if (query.includes(" OR ")) {
      const orTerms = queryLower.split(" OR ").map((t) => t.trim())
      return orTerms.some((term) => text.includes(term))
    }

    // Default: all terms must be present
    return terms.every((term) => text.includes(term))
  }

  private createSearchResult(
    item: Comment | Suggestion | CommentReply,
    query: string,
    type: "comment" | "suggestion" | "reply",
    parent?: Comment | Suggestion,
  ): CommentSearchResult | null {
    const documentId = "documentId" in item ? item.documentId : parent?.documentId
    if (!documentId) return null

    const document = this.documents[documentId]
    if (!document) return null

    let content = ""
    let selectedText = ""
    let position = { start: 0, end: 0 }

    if (type === "comment" && "content" in item) {
      content = item.content
      selectedText = "selectedText" in item ? item.selectedText || "" : ""
      position = "position" in item ? item.position : { start: 0, end: 0 }
    } else if (type === "suggestion" && "suggestedText" in item) {
      content = `${item.originalText} → ${item.suggestedText}`
      if (item.reason) content += ` (${item.reason})`
      position = item.position
    } else if (type === "reply") {
      content = item.content
      position = parent && "position" in parent ? parent.position : { start: 0, end: 0 }
    }

    const matchedText = this.highlightMatches(content, query)
    const matchScore = this.calculateMatchScore(content, query)
    const context = this.getContext(document.content, position)

    return {
      id: item.id,
      type,
      documentId,
      documentTitle: document.title,
      content,
      author: item.userName,
      authorColor: item.userColor,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      status: "status" in item ? item.status : "active",
      position,
      selectedText,
      parentId: parent?.id,
      matchedText,
      matchScore,
      context,
    }
  }

  private highlightMatches(text: string, query: string): string {
    if (!query.trim()) return text

    const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
    let highlightedText = text

    terms.forEach((term) => {
      const regex = new RegExp(`(${this.escapeRegex(term)})`, "gi")
      highlightedText = highlightedText.replace(regex, "<mark>$1</mark>")
    })

    return highlightedText
  }

  private calculateMatchScore(text: string, query: string): number {
    if (!query.trim()) return 0

    const textLower = text.toLowerCase()
    const queryLower = query.toLowerCase()
    const terms = queryLower.split(/\s+/).filter(Boolean)

    let score = 0

    // Exact phrase match gets highest score
    if (textLower.includes(queryLower)) {
      score += 100
    }

    // Individual term matches
    terms.forEach((term) => {
      if (textLower.includes(term)) {
        score += 10
      }
    })

    // Bonus for matches at the beginning
    if (textLower.startsWith(queryLower)) {
      score += 50
    }

    return score
  }

  private getContext(
    documentContent: string,
    position: { start: number; end: number },
  ): {
    before: string
    after: string
  } {
    const contextLength = 50
    const before = documentContent.substring(Math.max(0, position.start - contextLength), position.start)
    const after = documentContent.substring(
      position.end,
      Math.min(documentContent.length, position.end + contextLength),
    )

    return { before, after }
  }

  private sortResults(
    results: CommentSearchResult[],
    sortBy: string,
    sortOrder: "asc" | "desc",
  ): CommentSearchResult[] {
    return results.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "relevance":
          comparison = b.matchScore - a.matchScore
          break
        case "date":
          comparison = a.createdAt - b.createdAt
          break
        case "author":
          comparison = a.author.localeCompare(b.author)
          break
        case "document":
          comparison = a.documentTitle.localeCompare(b.documentTitle)
          break
        default:
          comparison = 0
      }

      return sortOrder === "desc" ? -comparison : comparison
    })
  }

  private calculateStats(results: CommentSearchResult[]): SearchStats {
    const commentCount = results.filter((r) => r.type === "comment").length
    const suggestionCount = results.filter((r) => r.type === "suggestion").length
    const replyCount = results.filter((r) => r.type === "reply").length

    const uniqueDocuments = new Set(results.map((r) => r.documentId))
    const uniqueAuthors = new Set(results.map((r) => r.author))

    return {
      totalResults: results.length,
      commentCount,
      suggestionCount,
      replyCount,
      documentCount: uniqueDocuments.size,
      authorCount: uniqueAuthors.size,
    }
  }

  private getDocumentInfo(results: CommentSearchResult[]): DocumentSearchInfo[] {
    const documentMap = new Map<string, DocumentSearchInfo>()

    results.forEach((result) => {
      const existing = documentMap.get(result.documentId)
      if (existing) {
        existing.resultCount++
        existing.lastActivity = Math.max(existing.lastActivity, result.updatedAt)
      } else {
        documentMap.set(result.documentId, {
          id: result.documentId,
          title: result.documentTitle,
          resultCount: 1,
          lastActivity: result.updatedAt,
        })
      }
    })

    return Array.from(documentMap.values()).sort((a, b) => b.resultCount - a.resultCount)
  }

  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  }

  // Get available filter options
  getFilterOptions(): {
    documents: { id: string; title: string }[]
    authors: string[]
    statuses: string[]
  } {
    const documents = Object.entries(this.documents).map(([id, doc]) => ({
      id,
      title: doc.title,
    }))

    const authors = new Set<string>()
    const statuses = new Set<string>()

    Object.values(this.comments).forEach((comment) => {
      authors.add(comment.userName)
      statuses.add(comment.status)
      comment.replies.forEach((reply) => authors.add(reply.userName))
    })

    Object.values(this.suggestions).forEach((suggestion) => {
      authors.add(suggestion.userName)
      statuses.add(suggestion.status)
      suggestion.replies.forEach((reply) => authors.add(reply.userName))
    })

    return {
      documents,
      authors: Array.from(authors).sort(),
      statuses: Array.from(statuses).sort(),
    }
  }
}
