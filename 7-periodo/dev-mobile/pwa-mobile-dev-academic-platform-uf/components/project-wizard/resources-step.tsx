"use client"

import { useEffect, useState } from "react"
import { Clock, DollarSign, Zap, Plus, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import type { ProjectData } from "@/app/projetos/wizard/page"

interface ResourcesStepProps {
  data: ProjectData
  onUpdate: (data: Partial<ProjectData>) => void
  onValidation: (isValid: boolean) => void
}

export function ProjectResourcesStep({ data, onUpdate, onValidation }: ResourcesStepProps) {
  const [hours, setHours] = useState(data.hours || 40)
  const [budget, setBudget] = useState(data.budget || 0)
  const [resources, setResources] = useState<string[]>(data.resources || [])
  const [newResource, setNewResource] = useState("")

  useEffect(() => {
    onValidation(hours > 0)
  }, [hours, onValidation])

  useEffect(() => {
    onUpdate({ hours, budget, resources })
  }, [hours, budget, resources, onUpdate])

  const addResource = () => {
    if (newResource.trim()) {
      setResources([...resources, newResource.trim()])
      setNewResource("")
    }
  }

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index))
  }

  const suggestedResources = [
    "Computadores/Laptops",
    "Software de desenvolvimento",
    "Licenças de ferramentas",
    "Hospedagem/Servidor",
    "Material de escritório",
    "Equipamentos de gravação",
    "Acesso a bibliotecas",
    "Transporte para pesquisa",
  ]

  const getProjectIntensity = () => {
    if (hours <= 40) return { level: "Baixa", color: "text-success", description: "Projeto de baixa intensidade" }
    if (hours <= 100) return { level: "Média", color: "text-warning", description: "Projeto de intensidade moderada" }
    return { level: "Alta", color: "text-destructive", description: "Projeto de alta intensidade" }
  }

  const intensity = getProjectIntensity()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Recursos e Cronograma</h2>
        <p className="text-gray-400">Defina os recursos necessários e a carga horária do projeto</p>
      </div>

      <div className="space-y-6">
        {/* Time Resources */}
        <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-6">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Carga Horária</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-gray-300">Horas totais estimadas</label>
                <span className="text-sm font-medium">{hours}h</span>
              </div>
              <Slider
                value={[hours]}
                onValueChange={(value) => setHours(value[0])}
                max={300}
                min={10}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>10h</span>
                <span>300h</span>
              </div>
            </div>

            <div
              className={`rounded-lg border p-3 ${
                intensity.level === "Baixa"
                  ? "border-success/20 bg-success/10"
                  : intensity.level === "Média"
                    ? "border-warning/20 bg-warning/10"
                    : "border-destructive/20 bg-destructive/10"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Zap className={`h-4 w-4 ${intensity.color}`} />
                <span className={`font-medium ${intensity.color}`}>Intensidade: {intensity.level}</span>
              </div>
              <p className="text-sm text-gray-300 mt-1">{intensity.description}</p>
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-6">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Orçamento (Opcional)</h3>
          </div>

          <div className="space-y-2">
            <Input
              type="number"
              placeholder="0"
              value={budget || ""}
              onChange={(e) => setBudget(Number(e.target.value) || 0)}
              className="border-white/10"
            />
            <p className="text-xs text-gray-400">Valor estimado em reais para recursos materiais e serviços</p>
          </div>
        </div>

        {/* Resources */}
        <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-6">
          <h3 className="font-semibold">Recursos Necessários</h3>

          {resources.length > 0 && (
            <div className="space-y-2">
              {resources.map((resource, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3"
                >
                  <span className="text-sm">{resource}</span>
                  <button onClick={() => removeResource(index)} className="text-gray-400 hover:text-red-500">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex space-x-2">
            <Input
              placeholder="Adicionar recurso..."
              value={newResource}
              onChange={(e) => setNewResource(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addResource()}
              className="flex-1 border-white/10"
            />
            <Button onClick={addResource} variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Suggested Resources */}
          {resources.length < 3 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Sugestões:</p>
              <div className="grid gap-2 md:grid-cols-2">
                {suggestedResources
                  .filter((suggestion) => !resources.includes(suggestion))
                  .slice(0, 4)
                  .map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setResources([...resources, suggestion])}
                      className="rounded border border-white/10 bg-white/5 p-2 text-left text-sm transition-colors hover:bg-white/10"
                    >
                      <div className="flex items-center space-x-2">
                        <Plus className="h-3 w-3 text-gray-400" />
                        <span>{suggestion}</span>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="rounded-lg border border-info/20 bg-info/10 p-4">
          <h4 className="font-semibold text-info mb-2">Resumo dos Recursos</h4>
          <div className="space-y-1 text-sm text-gray-300">
            <p>• Carga horária: {hours} horas</p>
            {budget > 0 && <p>• Orçamento: R$ {budget.toLocaleString()}</p>}
            <p>• Recursos listados: {resources.length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
