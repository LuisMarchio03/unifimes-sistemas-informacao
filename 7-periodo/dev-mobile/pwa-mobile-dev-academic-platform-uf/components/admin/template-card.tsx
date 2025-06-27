"use client"
import { MoreHorizontal, Edit, Trash2, Copy, Eye, BarChart3, Users, Clock, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Template {
  id: string
  name: string
  description: string
  category: string
  icon: string
  estimatedHours: number
  suggestedTeamSize: string
  objectives: string[]
  skills: string[]
  isActive: boolean
  usageCount: number
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

interface TemplateCardProps {
  template: Template
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
  onPreview: () => void
  onToggleStatus: () => void
}

export function TemplateCard({
  template,
  onEdit,
  onDelete,
  onDuplicate,
  onPreview,
  onToggleStatus,
}: TemplateCardProps) {
  const getIconComponent = (iconName: string) => {
    // This would normally map icon names to actual components
    return (
      <div className="h-6 w-6 rounded bg-primary/20 flex items-center justify-center text-xs">
        {iconName.slice(0, 2)}
      </div>
    )
  }

  return (
    <div
      className={`rounded-lg border p-6 transition-all hover:bg-white/5 ${
        template.isActive ? "border-white/10 bg-white/5" : "border-white/5 bg-white/2 opacity-60"
      }`}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-primary/10 p-2">{getIconComponent(template.icon)}</div>
          <div>
            <h3 className="font-semibold">{template.name}</h3>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <span>{template.category}</span>
              <span>•</span>
              <span className={template.isActive ? "text-success" : "text-warning"}>
                {template.isActive ? "Ativo" : "Inativo"}
              </span>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onPreview}>
              <Eye className="mr-2 h-4 w-4" />
              Visualizar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onToggleStatus}>
              <BarChart3 className="mr-2 h-4 w-4" />
              {template.isActive ? "Desativar" : "Ativar"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Description */}
      <p className="mb-4 text-sm text-gray-300 line-clamp-2">{template.description}</p>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-3 gap-4 text-xs">
        <div className="flex items-center space-x-1 text-gray-400">
          <Clock className="h-3 w-3" />
          <span>{template.estimatedHours}h</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-400">
          <Users className="h-3 w-3" />
          <span>{template.suggestedTeamSize}</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-400">
          <Target className="h-3 w-3" />
          <span>{template.objectives.length} obj.</span>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <div className="text-xs text-gray-400">Usado {template.usageCount} vezes</div>
        <div className="text-xs text-gray-400">Atualizado {template.updatedAt.toLocaleDateString()}</div>
      </div>

      {/* Skills Preview */}
      <div className="mt-3">
        <div className="flex flex-wrap gap-1">
          {template.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="rounded bg-white/10 px-2 py-1 text-xs text-gray-300">
              {skill}
            </span>
          ))}
          {template.skills.length > 3 && (
            <span className="rounded bg-white/5 px-2 py-1 text-xs text-gray-400">+{template.skills.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  )
}
