"use client"

import { useEffect, useState } from "react"
import { Plus, X, Target, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { ProjectData } from "@/app/projetos/wizard/page"

interface ObjectivesStepProps {
  data: ProjectData
  onUpdate: (data: Partial<ProjectData>) => void
  onValidation: (isValid: boolean) => void
}

export function ProjectObjectivesStep({ data, onUpdate, onValidation }: ObjectivesStepProps) {
  const [objectives, setObjectives] = useState<string[]>(data.objectives || [])
  const [newObjective, setNewObjective] = useState("")

  useEffect(() => {
    onValidation(objectives.length > 0)
  }, [objectives, onValidation])

  useEffect(() => {
    onUpdate({ objectives })
  }, [objectives, onUpdate])

  const addObjective = () => {
    if (newObjective.trim()) {
      setObjectives([...objectives, newObjective.trim()])
      setNewObjective("")
    }
  }

  const removeObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index))
  }

  const updateObjective = (index: number, value: string) => {
    const updated = [...objectives]
    updated[index] = value
    setObjectives(updated)
  }

  const suggestedObjectives = [
    "Realizar pesquisa de mercado",
    "Desenvolver protótipo funcional",
    "Criar documentação técnica",
    "Implementar testes automatizados",
    "Definir arquitetura do sistema",
    "Criar interface de usuário",
    "Estabelecer métricas de sucesso",
    "Validar solução com usuários",
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Objetivos e Metas</h2>
        <p className="text-gray-400">Defina os objetivos específicos que seu projeto deve alcançar</p>
      </div>

      <div className="space-y-6">
        {/* Current Objectives */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Objetivos do Projeto</h3>
          </div>

          {objectives.length > 0 && (
            <div className="space-y-3">
              {objectives.map((objective, index) => (
                <div key={index} className="group rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <Textarea
                      value={objective}
                      onChange={(e) => updateObjective(index, e.target.value)}
                      className="flex-1 min-h-[60px] border-none bg-transparent p-0 resize-none focus:ring-0"
                      placeholder="Descreva o objetivo..."
                    />
                    <button
                      onClick={() => removeObjective(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Objective */}
          <div className="space-y-3">
            <div className="flex space-x-2">
              <Input
                placeholder="Adicionar novo objetivo..."
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addObjective()}
                className="flex-1 border-white/10"
              />
              <Button onClick={addObjective} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Suggested Objectives */}
        {objectives.length < 3 && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-300">Sugestões de Objetivos</h4>
            <div className="grid gap-2 md:grid-cols-2">
              {suggestedObjectives
                .filter((suggestion) => !objectives.includes(suggestion))
                .slice(0, 6)
                .map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setObjectives([...objectives, suggestion])}
                    className="rounded-lg border border-white/10 bg-white/5 p-3 text-left text-sm transition-colors hover:bg-white/10"
                  >
                    <div className="flex items-center space-x-2">
                      <Plus className="h-4 w-4 text-gray-400" />
                      <span>{suggestion}</span>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Guidelines */}
        <div className="rounded-lg border border-info/20 bg-info/10 p-4">
          <h4 className="font-semibold text-info mb-2">Dicas para Objetivos Eficazes</h4>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• Seja específico e mensurável</li>
            <li>• Defina prazos realistas</li>
            <li>• Considere recursos disponíveis</li>
            <li>• Alinhe com o escopo do projeto</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
