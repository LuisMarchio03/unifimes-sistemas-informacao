"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import type { ProjectData } from "@/app/projetos/wizard/page"

const projectTypes = [
  { id: "academic", name: "Acadêmico", description: "Projeto vinculado à instituição de ensino" },
  { id: "professional", name: "Profissional", description: "Projeto com fins comerciais ou profissionais" },
  { id: "personal", name: "Pessoal", description: "Projeto de desenvolvimento pessoal" },
  { id: "social", name: "Social", description: "Projeto com impacto social" },
]

interface BasicInfoStepProps {
  data: ProjectData
  onUpdate: (data: Partial<ProjectData>) => void
  onValidation: (isValid: boolean) => void
}

export function ProjectBasicInfoStep({ data, onUpdate, onValidation }: BasicInfoStepProps) {
  const [title, setTitle] = useState(data.title || "")
  const [description, setDescription] = useState(data.description || "")
  const [type, setType] = useState(data.type || "")
  const [startDate, setStartDate] = useState<Date | undefined>(data.startDate)
  const [endDate, setEndDate] = useState<Date | undefined>(data.endDate)

  useEffect(() => {
    const isValid = title.trim().length > 0 && description.trim().length > 0 && type.length > 0 && startDate && endDate
    onValidation(isValid)
  }, [title, description, type, startDate, endDate, onValidation])

  useEffect(() => {
    onUpdate({
      title: title.trim(),
      description: description.trim(),
      type,
      startDate,
      endDate,
    })
  }, [title, description, type, startDate, endDate, onUpdate])

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Informações Básicas</h2>
        <p className="text-gray-400">Defina as informações fundamentais do seu projeto</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-gray-300">
            Título do Projeto *
          </label>
          <Input
            id="title"
            placeholder="Ex: Sistema de Gestão Integrada"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-white/10"
          />
          <p className="text-xs text-gray-400">Escolha um título claro e descritivo para seu projeto</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium text-gray-300">
            Descrição do Projeto *
          </label>
          <Textarea
            id="description"
            placeholder="Descreva o objetivo principal, escopo e resultados esperados do projeto..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[120px] border-white/10 bg-black/80"
          />
          <p className="text-xs text-gray-400">
            Forneça uma descrição detalhada que ajude outros a entender seu projeto
          </p>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-300">Tipo de Projeto *</label>
          <div className="grid gap-3 md:grid-cols-2">
            {projectTypes.map((projectType) => (
              <button
                key={projectType.id}
                type="button"
                onClick={() => setType(projectType.id)}
                className={`rounded-lg border p-4 text-left transition-all ${
                  type === projectType.id
                    ? "border-primary bg-primary/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <h4 className="font-medium">{projectType.name}</h4>
                <p className="text-xs text-gray-400 mt-1">{projectType.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Data de Início *</label>
            <DatePicker date={startDate} setDate={setStartDate} className="w-full" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Data de Conclusão *</label>
            <DatePicker date={endDate} setDate={setEndDate} className="w-full" />
          </div>
        </div>

        {startDate && endDate && (
          <div className="rounded-lg border border-info/20 bg-info/10 p-4">
            <h4 className="font-semibold text-info mb-2">Duração do Projeto</h4>
            <p className="text-sm text-gray-300">
              {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} dias (
              {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7))} semanas)
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
