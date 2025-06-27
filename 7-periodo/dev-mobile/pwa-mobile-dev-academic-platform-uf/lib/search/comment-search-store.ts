import { create } from "zustand"
import { CommentSearchEngine } from "./comment-search-engine"
import type { CommentSearchResult, SearchFilters, SearchStats, DocumentSearchInfo } from "./comment-search-types"

interface CommentSearchStore {
  searchEngine: CommentSearchEngine
  results: CommentSearchResult[]
  stats: SearchStats
  documents: DocumentSearchInfo[]
  filters: SearchFilters
  isSearching: boolean
  searchHistory: string[]
  savedSearches: Array<{ name: string; filters: SearchFilters }>

  // Actions
  search: (query?: string) => void
  updateFilters: (updates: Partial<SearchFilters>) => void
  clearSearch: () => void
  saveSearch: (name: string) => void
  loadSearch: (name: string) => void
  addToHistory: (query: string) => void
  getFilterOptions: () => {
    documents: { id: string; title: string }[]
    authors: string[]
    statuses: string[]
  }
}

const defaultFilters: SearchFilters = {
  query: "",
  documentIds: [],
  authors: [],
  types: [],
  statuses: [],
  dateRange: {
    start: null,
    end: null,
  },
  sortBy: "relevance",
  sortOrder: "desc",
}

const defaultStats: SearchStats = {
  totalResults: 0,
  commentCount: 0,
  suggestionCount: 0,
  replyCount: 0,
  documentCount: 0,
  authorCount: 0,
}

export const useCommentSearchStore = create<CommentSearchStore>((set, get) => ({
  searchEngine: new CommentSearchEngine(),
  results: [],
  stats: defaultStats,
  documents: [],
  filters: defaultFilters,
  isSearching: false,
  searchHistory: [],
  savedSearches: [
    {
      name: "Comentários não resolvidos",
      filters: {
        ...defaultFilters,
        types: ["comment"],
        statuses: ["active"],
      },
    },
    {
      name: "Sugestões pendentes",
      filters: {
        ...defaultFilters,
        types: ["suggestion"],
        statuses: ["pending"],
      },
    },
    {
      name: "Atividade da última semana",
      filters: {
        ...defaultFilters,
        dateRange: {
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          end: new Date(),
        },
      },
    },
  ],

  search: (query) => {
    set({ isSearching: true })

    const state = get()
    const filters = query !== undefined ? { ...state.filters, query } : state.filters

    // Simulate search delay
    setTimeout(() => {
      const { results, stats, documents } = state.searchEngine.search(filters)

      set({
        results,
        stats,
        documents,
        filters,
        isSearching: false,
      })

      if (query && query.trim()) {
        get().addToHistory(query)
      }
    }, 300)
  },

  updateFilters: (updates) => {
    set((state) => ({
      filters: { ...state.filters, ...updates },
    }))

    // Auto-search when filters change
    setTimeout(() => get().search(), 100)
  },

  clearSearch: () => {
    set({
      results: [],
      stats: defaultStats,
      documents: [],
      filters: defaultFilters,
    })
  },

  saveSearch: (name) => {
    set((state) => ({
      savedSearches: [
        ...state.savedSearches,
        {
          name,
          filters: { ...state.filters },
        },
      ],
    }))
  },

  loadSearch: (name) => {
    const state = get()
    const savedSearch = state.savedSearches.find((s) => s.name === name)
    if (savedSearch) {
      set({ filters: { ...savedSearch.filters } })
      get().search()
    }
  },

  addToHistory: (query) => {
    set((state) => {
      const newHistory = [query, ...state.searchHistory.filter((h) => h !== query)].slice(0, 10)
      return { searchHistory: newHistory }
    })
  },

  getFilterOptions: () => {
    return get().searchEngine.getFilterOptions()
  },
}))
