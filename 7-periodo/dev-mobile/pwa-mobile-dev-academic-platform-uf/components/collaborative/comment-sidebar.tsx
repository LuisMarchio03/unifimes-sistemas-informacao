"use client"

import { useState } from "react"
import { useCommentStore } from "@/lib/collaborative/comment-store"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Edit3, Check, X, Reply, Eye, EyeOff, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface CommentSidebarProps {
  documentId: string
  userId: string
  userName: string
}

export function CommentSidebar({ documentId, userId, userName }: CommentSidebarProps) {
  const {
    threads,
    activeThread,
    showResolved,
    selectedRange,
    addComment,
    addSuggestion,
    addReply,
    resolveComment,
    acceptSuggestion,
    rejectSuggestion,
    setActiveThread,
    getThreadsForDocument,
    toggleShowResolved,
  } = useCommentStore()

  const [newComment, setNewComment] = useState("")
  const [newSuggestion, setNewSuggestion] = useState("")
  const [suggestionReason, setSuggestionReason] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [activeTab, setActiveTab] = useState<"comment" | "suggestion">("comment")

  const documentThreads = getThreadsForDocument(documentId)
  const filteredThreads = showResolved
    ? documentThreads
    : documentThreads.filter(
        (thread) =>
          thread.comments.some((c) => c.status === "active") || thread.suggestions.some((s) => s.status === "pending"),
      )

  const handleAddComment = () => {
    if (!selectedRange || !newComment.trim()) return

    addComment(documentId, userId, userName, newComment, selectedRange, selectedRange.text)

    setNewComment("")
  }

  const handleAddSuggestion = () => {
    if (!selectedRange || !newSuggestion.trim()) return

    addSuggestion(documentId, userId, userName, selectedRange.text, newSuggestion, selectedRange, suggestionReason)

    setNewSuggestion("")
    setSuggestionReason("")
  }

  const handleAddReply = (commentId: string) => {
    if (!replyContent.trim()) return

    addReply(commentId, userId, userName, replyContent)
    setReplyContent("")
    setReplyingTo(null)
  }

  return (
    <div className="w-80 border-l border-white/10 bg-black/40 backdrop-blur-sm">
      {/* Header */}
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">Comentários</h3>
          <Button variant="ghost" size="sm" onClick={toggleShowResolved} className="text-xs">
            {showResolved ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showResolved ? "Ocultar resolvidos" : "Mostrar resolvidos"}
          </Button>
        </div>

        <div className="mt-2 text-xs text-gray-400">
          {filteredThreads.length} thread{filteredThreads.length !== 1 ? "s" : ""} ativa
          {filteredThreads.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* New comment/suggestion form */}
      {selectedRange && (
        <div className="border-b border-white/10 p-4">
          <div className="mb-3">
            <div className="text-xs text-gray-400 mb-1">Texto selecionado:</div>
            <div className="rounded bg-white/5 p-2 text-xs text-gray-300 italic">"{selectedRange.text}"</div>
          </div>

          {/* Tab selector */}
          <div className="flex mb-3 rounded-lg bg-white/5 p-1">
            <button
              onClick={() => setActiveTab("comment")}
              className={`flex-1 rounded px-3 py-1 text-xs transition-colors ${
                activeTab === "comment" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              <MessageSquare className="h-3 w-3 inline mr-1" />
              Comentário
            </button>
            <button
              onClick={() => setActiveTab("suggestion")}
              className={`flex-1 rounded px-3 py-1 text-xs transition-colors ${
                activeTab === "suggestion" ? "bg-green-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              <Edit3 className="h-3 w-3 inline mr-1" />
              Sugestão
            </button>
          </div>

          {activeTab === "comment" ? (
            <div className="space-y-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Adicione um comentário..."
                className="min-h-[80px] text-sm"
              />
              <Button onClick={handleAddComment} disabled={!newComment.trim()} size="sm" className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Adicionar Comentário
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Textarea
                value={newSuggestion}
                onChange={(e) => setNewSuggestion(e.target.value)}
                placeholder="Texto sugerido..."
                className="min-h-[60px] text-sm"
              />
              <Textarea
                value={suggestionReason}
                onChange={(e) => setSuggestionReason(e.target.value)}
                placeholder="Motivo da sugestão (opcional)..."
                className="min-h-[40px] text-sm"
              />
              <Button
                onClick={handleAddSuggestion}
                disabled={!newSuggestion.trim()}
                size="sm"
                className="w-full"
                variant="secondary"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Sugerir Alteração
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Threads list */}
      <div className="flex-1 overflow-y-auto">
        {filteredThreads.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum comentário ainda</p>
            <p className="text-xs mt-1">Selecione texto para adicionar comentários</p>
          </div>
        ) : (
          <div className="space-y-4 p-4">
            {filteredThreads.map((thread) => (
              <div
                key={thread.id}
                className={`rounded-lg border p-3 transition-colors cursor-pointer ${
                  activeThread === thread.id
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
                onClick={() => setActiveThread(thread.id)}
              >
                {/* Comments in thread */}
                {thread.comments.map((comment) => (
                  <div key={comment.id} className="mb-3 last:mb-0">
                    <div className="flex items-start gap-2">
                      <div
                        className="h-6 w-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-medium text-white"
                        style={{ backgroundColor: comment.userColor }}
                      >
                        {comment.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-white">{comment.userName}</span>
                          <span className="text-xs text-gray-400">
                            {formatDistanceToNow(comment.createdAt, {
                              addSuffix: true,
                              locale: ptBR,
                            })}
                          </span>
                          {comment.status === "resolved" && <CheckCircle className="h-3 w-3 text-green-500" />}
                        </div>

                        {comment.selectedText && (
                          <div className="text-xs text-gray-400 mb-1 italic">"{comment.selectedText}"</div>
                        )}

                        <p className="text-sm text-gray-200 mb-2">{comment.content}</p>

                        {/* Comment actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setReplyingTo(comment.id)
                            }}
                            className="h-6 px-2 text-xs"
                          >
                            <Reply className="h-3 w-3 mr-1" />
                            Responder
                          </Button>

                          {comment.status === "active" && comment.userId === userId && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                resolveComment(comment.id)
                              }}
                              className="h-6 px-2 text-xs"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Resolver
                            </Button>
                          )}
                        </div>

                        {/* Replies */}
                        {comment.replies.length > 0 && (
                          <div className="mt-2 space-y-2 border-l-2 border-white/10 pl-3">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start gap-2">
                                <div
                                  className="h-4 w-4 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-medium text-white"
                                  style={{ backgroundColor: reply.userColor }}
                                >
                                  {reply.userName.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-medium text-white">{reply.userName}</span>
                                    <span className="text-xs text-gray-400">
                                      {formatDistanceToNow(reply.createdAt, {
                                        addSuffix: true,
                                        locale: ptBR,
                                      })}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-200">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reply form */}
                        {replyingTo === comment.id && (
                          <div className="mt-2 space-y-2">
                            <Textarea
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder="Escreva uma resposta..."
                              className="min-h-[60px] text-sm"
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleAddReply(comment.id)}
                                disabled={!replyContent.trim()}
                                size="sm"
                                className="text-xs"
                              >
                                Responder
                              </Button>
                              <Button
                                onClick={() => {
                                  setReplyingTo(null)
                                  setReplyContent("")
                                }}
                                variant="ghost"
                                size="sm"
                                className="text-xs"
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Suggestions in thread */}
                {thread.suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="mb-3 last:mb-0">
                    <div className="flex items-start gap-2">
                      <div
                        className="h-6 w-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-medium text-white"
                        style={{ backgroundColor: suggestion.userColor }}
                      >
                        <Edit3 className="h-3 w-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-white">{suggestion.userName}</span>
                          <span className="text-xs text-gray-400">sugeriu uma alteração</span>
                          <span className="text-xs text-gray-400">
                            {formatDistanceToNow(suggestion.createdAt, {
                              addSuffix: true,
                              locale: ptBR,
                            })}
                          </span>
                          {suggestion.status === "accepted" && <CheckCircle className="h-3 w-3 text-green-500" />}
                          {suggestion.status === "rejected" && <XCircle className="h-3 w-3 text-red-500" />}
                          {suggestion.status === "pending" && <AlertCircle className="h-3 w-3 text-yellow-500" />}
                        </div>

                        {/* Original vs suggested text */}
                        <div className="space-y-2 mb-2">
                          <div className="rounded bg-red-500/20 p-2 border border-red-500/30">
                            <div className="text-xs text-red-300 mb-1">Original:</div>
                            <div className="text-sm text-red-100 line-through">{suggestion.originalText}</div>
                          </div>
                          <div className="rounded bg-green-500/20 p-2 border border-green-500/30">
                            <div className="text-xs text-green-300 mb-1">Sugerido:</div>
                            <div className="text-sm text-green-100">{suggestion.suggestedText}</div>
                          </div>
                        </div>

                        {suggestion.reason && (
                          <p className="text-sm text-gray-200 mb-2">
                            <span className="text-gray-400">Motivo:</span> {suggestion.reason}
                          </p>
                        )}

                        {/* Suggestion actions */}
                        {suggestion.status === "pending" && (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                acceptSuggestion(suggestion.id)
                              }}
                              className="h-6 px-2 text-xs text-green-400 hover:text-green-300"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Aceitar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                rejectSuggestion(suggestion.id)
                              }}
                              className="h-6 px-2 text-xs text-red-400 hover:text-red-300"
                            >
                              <X className="h-3 w-3 mr-1" />
                              Rejeitar
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
