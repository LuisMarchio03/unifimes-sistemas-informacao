"use client"

import { BookOpen, Users, Clock, Target, Star } from "lucide-react"

interface TemplateData {
  name: string
  description: string
  category: string
  icon: string
  estimatedHours: number
  suggestedTeamSize: string
  objectives: string[]
  skills: string[]
}

interface TemplatePreviewProps {
  template: TemplateData
}

export function TemplatePreview({ template }: TemplatePreviewProps) {
  const getIconComponent = (iconName: string) => {
    // This would normally map to actual Lucide icons
    return <BookOpen className="h-6 w-6" />
  }

  return (
    <div className="h-full bg-white/5 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Visualização do Template</h2>
        <p className="text-sm text-gray-400">Como este template aparecerá para os usuários no wizard de criação</p>
      </div>

      {/* Template Card Preview */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-6 mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-primary/10 p-2">{getIconComponent(template.icon)}</div>
            <div>
              <h3 className="font-semibold">{template.name || "Nome do Template"}</h3>
              <span className="text-xs text-gray-400">{template.category || "Categoria"}</span>
            </div>
          </div>
          <div className="rounded-full bg-primary p-1">
            <Star className="h-4 w-4" />
          </div>
        </div>

        <p className="mb-4 text-sm text-gray-300">
          {template.description || "Descrição do template aparecerá aqui..."}
        </p>

        <div className="space-y-2 text-xs text-gray-400 mb-4">
          <div className="flex justify-between">
            <span>Duração estimada:</span>
            <span>{template.estimatedHours}h</span>
          </div>
          <div className="flex justify-between">
            <span>Equipe sugerida:</span>
            <span>{template.suggestedTeamSize}</span>
          </div>
        </div>

        {template.objectives.filter((o) => o.trim()).length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium text-gray-400">Principais objetivos:</p>
            <ul className="space-y-1">
              {template.objectives
                .filter((o) => o.trim())
                .slice(0, 3)
                .map((objective, index) => (
                  <li key={index} className="text-xs text-gray-300">
                    • {objective}
                  </li>
                ))}
              {template.objectives.filter((o) => o.trim()).length > 3 && (
                <li className="text-xs text-gray-400">
                  + {template.objectives.filter((o) => o.trim()).length - 3} outros objetivos
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Template Details */}
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Objetivos Completos</h3>
          <div className="space-y-2">
            {template.objectives
              .filter((o) => o.trim())
              .map((objective, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <Target className="h-4 w-4 text-primary" />
                  <span>{objective}</span>
                </div>
              ))}
            {template.objectives.filter((o) => o.trim()).length === 0 && (
              <p className="text-sm text-gray-400">Nenhum objetivo definido</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Habilidades Recomendadas</h3>
          <div className="flex flex-wrap gap-2">
            {template.skills.map((skill, index) => (
              <span key={index} className="rounded bg-primary/20 px-2 py-1 text-xs text-primary">
                {skill}
              </span>
            ))}
            {template.skills.length === 0 && <p className="text-sm text-gray-400">Nenhuma habilidade definida</p>}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Informações do Projeto</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>{template.estimatedHours} horas estimadas</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span>{template.suggestedTeamSize}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
