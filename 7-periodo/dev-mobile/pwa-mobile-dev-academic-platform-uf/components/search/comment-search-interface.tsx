"use client"

import { useState, useEffect } from "react"
import { useCommentSearchStore } from "@/lib/search/comment-search-store"
import { useCommentStore } from "@/lib/collaborative/comment-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
  X,
  FileText,
  MessageSquare,
  Edit3,
  Reply,
  TrendingUp,
  Save,
  History,
  ExternalLink,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

export function CommentSearchInterface() {
  const {
    results,
    stats,
    documents,
    filters,
    isSearching,
    searchHistory,
    savedSearches,
    search,
    updateFilters,
    clearSearch,
    saveSearch,
    loadSearch,
    getFilterOptions,
  } = useCommentSearchStore()

  const { comments, suggestions } = useCommentStore()

  const [showFilters, setShowFilters] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showSavedSearches, setShowSavedSearches] = useState(false)
  const [saveSearchName, setSaveSearchName] = useState("")
  const [selectedResult, setSelectedResult] = useState<string | null>(null)

  const filterOptions = getFilterOptions()

  // Update search engine data when comments/suggestions change
  useEffect(() => {
    useCommentSearchStore.getState().searchEngine.updateData(comments, suggestions)
  }, [comments, suggestions])

  const handleSearch = (query: string) => {
    search(query)
  }

  const handleSaveSearch = () => {
    if (saveSearchName.trim()) {
      saveSearch(saveSearchName)
      setSaveSearchName("")
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "comment":
        return <MessageSquare className="h-4 w-4" />
      case "suggestion":
        return <Edit3 className="h-4 w-4" />
      case "reply":
        return <Reply className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-500/20 text-blue-300"
      case "resolved":
        return "bg-green-500/20 text-green-300"
      case "pending":
        return "bg-yellow-500/20 text-yellow-300"
      case "accepted":
        return "bg-green-500/20 text-green-300"
      case "rejected":
        return "bg-red-500/20 text-red-300"
      default:
        return "bg-gray-500/20 text-gray-300"
    }
  }

  return (
    <div className="h-screen flex flex-col bg-black/40 backdrop-blur-sm">
      {/* Header */}
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={filters.query}
              onChange={(e) => updateFilters({ query: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(filters.query)}
              placeholder="Pesquisar comentários e sugestões..."
              className="pl-10 pr-4"
            />
          </div>
          <Button onClick={() => handleSearch(filters.query)} disabled={isSearching}>
            {isSearching ? "Pesquisando..." : "Pesquisar"}
          </Button>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2 text-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className="text-gray-400 hover:text-white"
          >
            <History className="h-3 w-3 mr-1" />
            Histórico
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSavedSearches(!showSavedSearches)}
            className="text-gray-400 hover:text-white"
          >
            <Save className="h-3 w-3 mr-1" />
            Pesquisas Salvas
          </Button>
          {(filters.query || filters.documentIds.length > 0 || filters.authors.length > 0) && (
            <Button variant="ghost" size="sm" onClick={clearSearch} className="text-red-400 hover:text-red-300">
              <X className="h-3 w-3 mr-1" />
              Limpar
            </Button>
          )}
        </div>

        {/* Search history dropdown */}
        {showHistory && searchHistory.length > 0 && (
          <div className="mt-2 p-2 bg-white/5 rounded-lg border border-white/10">
            <div className="text-xs text-gray-400 mb-2">Pesquisas recentes:</div>
            <div className="space-y-1">
              {searchHistory.map((query, index) => (
                <button
                  key={index}
                  onClick={() => {
                    updateFilters({ query })
                    handleSearch(query)
                    setShowHistory(false)
                  }}
                  className="block w-full text-left text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded px-2 py-1"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Saved searches dropdown */}
        {showSavedSearches && (
          <div className="mt-2 p-2 bg-white/5 rounded-lg border border-white/10">
            <div className="text-xs text-gray-400 mb-2">Pesquisas salvas:</div>
            <div className="space-y-1">
              {savedSearches.map((savedSearch) => (
                <button
                  key={savedSearch.name}
                  onClick={() => {
                    loadSearch(savedSearch.name)
                    setShowSavedSearches(false)
                  }}
                  className="block w-full text-left text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded px-2 py-1"
                >
                  {savedSearch.name}
                </button>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-white/10">
              <div className="flex gap-2">
                <Input
                  value={saveSearchName}
                  onChange={(e) => setSaveSearchName(e.target.value)}
                  placeholder="Nome da pesquisa..."
                  className="text-xs h-8"
                />
                <Button onClick={handleSaveSearch} disabled={!saveSearchName.trim()} size="sm" className="h-8">
                  Salvar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="border-b border-white/10 p-4 bg-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Document filter */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">Documentos</label>
              <select
                multiple
                value={filters.documentIds}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, (option) => option.value)
                  updateFilters({ documentIds: values })
                }}
                className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white"
                size={3}
              >
                {filterOptions.documents.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Author filter */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">Autores</label>
              <select
                multiple
                value={filters.authors}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, (option) => option.value)
                  updateFilters({ authors: values })
                }}
                className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white"
                size={3}
              >
                {filterOptions.authors.map((author) => (
                  <option key={author} value={author}>
                    {author}
                  </option>
                ))}
              </select>
            </div>

            {/* Type filter */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">Tipos</label>
              <div className="space-y-1">
                {["comment", "suggestion", "reply"].map((type) => (
                  <label key={type} className="flex items-center text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={filters.types.includes(type as any)}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...filters.types, type as any]
                          : filters.types.filter((t) => t !== type)
                        updateFilters({ types: newTypes })
                      }}
                      className="mr-2"
                    />
                    {type === "comment" && "Comentários"}
                    {type === "suggestion" && "Sugestões"}
                    {type === "reply" && "Respostas"}
                  </label>
                ))}
              </div>
            </div>

            {/* Status filter */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">Status</label>
              <div className="space-y-1">
                {filterOptions.statuses.map((status) => (
                  <label key={status} className="flex items-center text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={filters.statuses.includes(status)}
                      onChange={(e) => {
                        const newStatuses = e.target.checked
                          ? [...filters.statuses, status]
                          : filters.statuses.filter((s) => s !== status)
                        updateFilters({ statuses: newStatuses })
                      }}
                      className="mr-2"
                    />
                    {status}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Sort options */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-400">Ordenar por:</label>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
                className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white"
              >
                <option value="relevance">Relevância</option>
                <option value="date">Data</option>
                <option value="author">Autor</option>
                <option value="document">Documento</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-400">Ordem:</label>
              <select
                value={filters.sortOrder}
                onChange={(e) => updateFilters({ sortOrder: e.target.value as any })}
                className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white"
              >
                <option value="desc">Decrescente</option>
                <option value="asc">Crescente</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      {stats.totalResults > 0 && (
        <div className="border-b border-white/10 p-4 bg-white/5">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <span className="text-white font-medium">{stats.totalResults}</span>
              <span className="text-gray-400">resultados</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-3 w-3 text-blue-400" />
              <span className="text-gray-300">{stats.commentCount} comentários</span>
            </div>
            <div className="flex items-center gap-2">
              <Edit3 className="h-3 w-3 text-green-400" />
              <span className="text-gray-300">{stats.suggestionCount} sugestões</span>
            </div>
            <div className="flex items-center gap-2">
              <Reply className="h-3 w-3 text-purple-400" />
              <span className="text-gray-300">{stats.replyCount} respostas</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-3 w-3 text-yellow-400" />
              <span className="text-gray-300">{stats.documentCount} documentos</span>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="flex-1 overflow-hidden flex">
        {/* Results list */}
        <div className="flex-1 overflow-y-auto">
          {isSearching ? (
            <div className="p-8 text-center">
              <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Pesquisando...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center">
              <Search className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">
                {filters.query || filters.documentIds.length > 0 || filters.authors.length > 0
                  ? "Nenhum resultado encontrado"
                  : "Digite algo para pesquisar"}
              </p>
              <p className="text-gray-500 text-sm">
                Pesquise por comentários, sugestões ou respostas em todos os documentos
              </p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {results.map((result) => (
                <div
                  key={result.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedResult === result.id
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                  onClick={() => setSelectedResult(selectedResult === result.id ? null : result.id)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center text-white"
                      style={{ backgroundColor: result.authorColor }}
                    >
                      {getTypeIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-white">{result.author}</span>
                        <Badge className={`text-xs ${getStatusColor(result.status)}`}>{result.status}</Badge>
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(result.createdAt, { addSuffix: true, locale: ptBR })}
                        </span>
                        <span className="text-xs text-gray-500">em {result.documentTitle}</span>
                      </div>

                      {result.selectedText && (
                        <div className="text-xs text-gray-400 mb-2 italic">"{result.selectedText}"</div>
                      )}

                      <div
                        className="text-sm text-gray-200 mb-2"
                        dangerouslySetInnerHTML={{ __html: result.matchedText }}
                      />

                      {selectedResult === result.id && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <div className="text-xs text-gray-400 mb-2">Contexto:</div>
                          <div className="text-xs text-gray-500">
                            ...{result.context.before}
                            <span className="bg-yellow-500/30 px-1 rounded">{result.selectedText}</span>
                            {result.context.after}...
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <Button size="sm" variant="outline" className="text-xs">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Abrir documento
                            </Button>
                            <Button size="sm" variant="ghost" className="text-xs">
                              Ir para comentário
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Document sidebar */}
        {documents.length > 0 && (
          <div className="w-64 border-l border-white/10 bg-white/5 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-medium text-white mb-3">Documentos ({documents.length})</h3>
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-3 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-medium text-white truncate">{doc.title}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {doc.resultCount} resultado{doc.resultCount !== 1 ? "s" : ""}
                    </div>
                    <div className="text-xs text-gray-500">
                      Última atividade: {formatDistanceToNow(doc.lastActivity, { addSuffix: true, locale: ptBR })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
