"use client"

import { useEffect } from "react"
import { Calendar, Clock, Target, Users, Zap } from "lucide-react"
import type { ProjectData } from "@/app/projetos/wizard/page"

interface ReviewStepProps {
  data: ProjectData
  onUpdate: (data: Partial<ProjectData>) => void
  onValidation: (isValid: boolean) => void
}

export function ProjectReviewStep({ data, onUpdate, onValidation }: ReviewStepProps) {
  useEffect(() => {
    onValidation(true) // Review step is always valid
  }, [onValidation])

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Não definida"
    return date.toLocaleDateString("pt-BR")
  }

  const getProjectDuration = () => {
    if (!data.startDate || !data.endDate) return "Não calculada"
    const days = Math.ceil((data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24))
    const weeks = Math.ceil(days / 7)
    return `${days} dias (${weeks} semanas)`
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Revisão do Projeto</h2>
        <p className="text-gray-400">Revise todas as informações antes de criar o projeto</p>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
          <h3 className="font-semibold mb-4 flex items-center space-x-2">
            <Zap className="h-5 w-5 text-primary" />
            <span>Informações Básicas</span>
          </h3>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-400">Título</p>
              <p className="font-medium">{data.title || "Não definido"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Descrição</p>
              <p className="text-sm text-gray-300">{data.description || "Não definida"}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-400">Tipo</p>
                <p className="font-medium capitalize">{data.type || "Não definido"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Categoria</p>
                <p className="font-medium">{data.category || "Não definida"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
          <h3 className="font-semibold mb-4 flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Cronograma</span>
          </h3>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-gray-400">Data de Início</p>
              <p className="font-medium">{formatDate(data.startDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Data de Conclusão</p>
              <p className="font-medium">{formatDate(data.endDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Duração</p>
              <p className="font-medium">{getProjectDuration()}</p>
            </div>
          </div>
        </div>

        {/* Objectives */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
          <h3 className="font-semibold mb-4 flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary" />
            <span>Objetivos ({data.objectives?.length || 0})</span>
          </h3>

          {data.objectives && data.objectives.length > 0 ? (
            <ul className="space-y-2">
              {data.objectives.map((objective, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-sm text-gray-300">{objective}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">Nenhum objetivo definido</p>
          )}
        </div>

        {/* Team */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
          <h3 className="font-semibold mb-4 flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Equipe ({data.participants?.length || 0} membros)</span>
          </h3>

          {data.participants && data.participants.length > 0 ? (
            <div className="space-y-3">
              {data.participants.map((participant, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                    {participant.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{participant.email}</p>
                    <p className="text-xs text-gray-400 capitalize">{participant.role}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Nenhum membro adicionado</p>
          )}
        </div>

        {/* Resources */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
          <h3 className="font-semibold mb-4 flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <span>Recursos</span>
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-400">Carga Horária</p>
              <p className="font-medium">{data.hours || 0} horas</p>
            </div>
            {data.budget && data.budget > 0 && (
              <div>
                <p className="text-sm text-gray-400">Orçamento</p>
                <p className="font-medium">R$ {data.budget.toLocaleString()}</p>
              </div>
            )}
          </div>

          {data.resources && data.resources.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">Recursos Necessários</p>
              <div className="flex flex-wrap gap-2">
                {data.resources.map((resource, index) => (
                  <span key={index} className="rounded-full bg-white/10 px-3 py-1 text-xs">
                    {resource}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div className="rounded-lg border border-white/10 bg-white/5 p-6">
            <h3 className="font-semibold mb-4">Habilidades Sugeridas</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span key={index} className="rounded-full bg-primary/20 px-3 py-1 text-xs text-primary">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Confirmation */}
        <div className="rounded-lg border border-success/20 bg-success/10 p-4">
          <h4 className="font-semibold text-success mb-2">Pronto para Criar!</h4>
          <p className="text-sm text-gray-300">
            Todas as informações foram preenchidas. Clique em "Criar Projeto" para finalizar.
          </p>
        </div>
      </div>
    </div>
  )
}
