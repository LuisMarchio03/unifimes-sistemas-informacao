"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TaskFilters, SortConfig } from "@/lib/types/filters"
import { TaskPriority } from "@/lib/types/task"
import { Filter } from "lucide-react"

interface TaskFiltersProps {
  filters: TaskFilters
  sortConfig: SortConfig
  onFiltersChange: (filters: TaskFilters) => void
  onSortChange: (sort: SortConfig) => void
}

export function TaskFiltersPanel({
  filters,
  sortConfig,
  onFiltersChange,
  onSortChange,
}: TaskFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const updateFilters = (updates: Partial<TaskFilters>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const togglePriority = (priority: TaskPriority) => {
    const currentPriorities = filters.priority || []
    const newPriorities = currentPriorities.includes(priority)
      ? currentPriorities.filter(p => p !== priority)
      : [...currentPriorities, priority]
    updateFilters({ priority: newPriorities })
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={isOpen ? "bg-primary/10 text-primary" : ""}
      >
        <Filter className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-white/10 bg-black/90 p-4 shadow-lg backdrop-blur-sm">
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 text-sm font-medium">Ordenar por</h4>
              <div className="flex items-center gap-2">
                <select
                  className="flex-1 rounded-lg border border-white/10 bg-black/80 px-3 py-2 text-sm"
                  value={sortConfig.by}
                  onChange={(e) => onSortChange({ ...sortConfig, by: e.target.value as SortConfig["by"] })}
                >
                  <option value="created">Data de Criação</option>
                  <option value="priority">Prioridade</option>
                  <option value="dueDate">Data de Entrega</option>
                  <option value="title">Título</option>
                </select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    onSortChange({
                      ...sortConfig,
                      direction: sortConfig.direction === "asc" ? "desc" : "asc",
                    })
                  }
                >
                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                </Button>
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium">Prioridade</h4>
              <div className="flex flex-wrap gap-2">
                {["high", "medium", "low"].map((priority) => (
                  <Button
                    key={priority}
                    variant="outline"
                    size="sm"
                    className={
                      filters.priority?.includes(priority as TaskPriority)
                        ? "bg-primary/10 text-primary"
                        : ""
                    }
                    onClick={() => togglePriority(priority as TaskPriority)}
                  >
                    {priority === "high"
                      ? "Alta"
                      : priority === "medium"
                      ? "Média"
                      : "Baixa"}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium">Esforço (horas)</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    type="number"
                    placeholder="Min"
                    className="border-white/10"
                    value={filters.minEffort || ""}
                    onChange={(e) =>
                      updateFilters({ minEffort: parseInt(e.target.value) || undefined })
                    }
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="Max"
                    className="border-white/10"
                    value={filters.maxEffort || ""}
                    onChange={(e) =>
                      updateFilters({ maxEffort: parseInt(e.target.value) || undefined })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.hasDueDate}
                  onChange={(e) => updateFilters({ hasDueDate: e.target.checked })}
                  className="rounded border-white/10 bg-black"
                />
                <span className="text-sm">Com data de entrega</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.overdue}
                  onChange={(e) => updateFilters({ overdue: e.target.checked })}
                  className="rounded border-white/10 bg-black"
                />
                <span className="text-sm">Atrasadas</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.hasSubtasks}
                  onChange={(e) => updateFilters({ hasSubtasks: e.target.checked })}
                  className="rounded border-white/10 bg-black"
                />
                <span className="text-sm">Com subtarefas</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
