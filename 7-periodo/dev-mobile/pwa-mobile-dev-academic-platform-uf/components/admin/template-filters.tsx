"use client"

import { useState } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FilterOptions {
  status: string[]
  categories: string[]
  usageRange: [number, number]
  hoursRange: [number, number]
}

interface TemplateFiltersProps {
  onFilterChange: (filters: FilterOptions) => void
}

export function TemplateFilters({ onFilterChange }: TemplateFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    categories: [],
    usageRange: [0, 100],
    hoursRange: [0, 300],
  })

  const statusOptions = [
    { value: "active", label: "Ativo" },
    { value: "inactive", label: "Inativo" },
  ]

  const categoryOptions = ["Pesquisa", "Extensão", "Inovação", "Tecnologia", "Design", "Dados"]

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters: FilterOptions = {
      status: [],
      categories: [],
      usageRange: [0, 100],
      hoursRange: [0, 300],
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.categories.length > 0 ||
    filters.usageRange[0] > 0 ||
    filters.usageRange[1] < 100 ||
    filters.hoursRange[0] > 0 ||
    filters.hoursRange[1] < 300

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold flex items-center">
          <Filter className="mr-2 h-4 w-4" />
          Filtros Avançados
        </h3>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Limpar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <div className="space-y-2">
            {statusOptions.map((option) => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.status.includes(option.value)}
                  onChange={(e) => {
                    const newStatus = e.target.checked
                      ? [...filters.status, option.value]
                      : filters.status.filter((s) => s !== option.value)
                    updateFilter("status", newStatus)
                  }}
                  className="rounded border-white/10"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Categorias</label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {categoryOptions.map((category) => (
              <label key={category} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={(e) => {
                    const newCategories = e.target.checked
                      ? [...filters.categories, category]
                      : filters.categories.filter((c) => c !== category)
                    updateFilter("categories", newCategories)
                  }}
                  className="rounded border-white/10"
                />
                <span className="text-sm">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Usage Range */}
        <div>
          <label className="block text-sm font-medium mb-2">Uso (projetos)</label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="100"
              value={filters.usageRange[0]}
              onChange={(e) => updateFilter("usageRange", [Number.parseInt(e.target.value), filters.usageRange[1]])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>{filters.usageRange[0]}</span>
              <span>{filters.usageRange[1]}+</span>
            </div>
          </div>
        </div>

        {/* Hours Range */}
        <div>
          <label className="block text-sm font-medium mb-2">Horas estimadas</label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="300"
              value={filters.hoursRange[0]}
              onChange={(e) => updateFilter("hoursRange", [Number.parseInt(e.target.value), filters.hoursRange[1]])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>{filters.hoursRange[0]}h</span>
              <span>{filters.hoursRange[1]}h+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
