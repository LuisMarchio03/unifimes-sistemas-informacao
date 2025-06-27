"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Eye, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { TemplatePreview } from "@/components/admin/template-preview"
import { IconSelector } from "@/components/admin/icon-selector"
import { SkillSelector } from "@/components/admin/skill-selector"

interface TemplateFormData {
  name: string
  description: string
  category: string
  icon: string
  estimatedHours: number
  suggestedTeamSize: string
  objectives: string[]
  skills: string[]
  isActive: boolean
}

const categories = ["Pesquisa", "Extensão", "Inovação", "Tecnologia", "Design", "Dados", "Marketing", "Educação"]

export default function NewTemplate() {
  const [formData, setFormData] = useState<TemplateFormData>({
    name: "",
    description: "",
    category: "",
    icon: "BookOpen",
    estimatedHours: 80,
    suggestedTeamSize: "3-5 pessoas",
    objectives: [""],
    skills: [],
    isActive: true,
  })
  const [showPreview, setShowPreview] = useState(false)
  const [newObjective, setNewObjective] = useState("")

  const updateFormData = (field: keyof TemplateFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addObjective = () => {
    if (newObjective.trim()) {
      updateFormData("objectives", [...formData.objectives.filter((o) => o.trim()), newObjective.trim()])
      setNewObjective("")
    }
  }

  const removeObjective = (index: number) => {
    updateFormData(
      "objectives",
      formData.objectives.filter((_, i) => i !== index),
    )
  }

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...formData.objectives]
    newObjectives[index] = value
    updateFormData("objectives", newObjectives)
  }

  const handleSave = () => {
    // Validate and save template
    console.log("Saving template:", formData)
  }

  const isValid =
    formData.name.trim() &&
    formData.description.trim() &&
    formData.category &&
    formData.objectives.filter((o) => o.trim()).length > 0

  return (
    <div className="flex min-h-screen">
      {/* Main Form */}
      <div className={`flex-1 ${showPreview ? "lg:w-1/2" : "w-full"}`}>
        {/* Header */}
        <header className="border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/admin/templates" className="mr-4">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-xl font-bold">Novo Template</h1>
                <p className="text-sm text-gray-400">Crie um novo modelo de projeto</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setShowPreview(!showPreview)} className="flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                {showPreview ? "Ocultar" : "Visualizar"}
              </Button>
              <Button onClick={handleSave} disabled={!isValid} className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Salvar Template
              </Button>
            </div>
          </div>
        </header>

        {/* Form Content */}
        <main className="p-6">
          <div className="max-w-2xl space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Informações Básicas</h2>

              <div>
                <label className="block text-sm font-medium mb-2">Nome do Template</label>
                <Input
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  placeholder="Ex: Projeto de Pesquisa Científica"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  placeholder="Descreva o tipo de projeto e seus principais características..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => updateFormData("category", e.target.value)}
                    className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Ícone</label>
                  <IconSelector value={formData.icon} onChange={(icon) => updateFormData("icon", icon)} />
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Detalhes do Projeto</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Horas Estimadas</label>
                  <Input
                    type="number"
                    value={formData.estimatedHours}
                    onChange={(e) => updateFormData("estimatedHours", Number.parseInt(e.target.value) || 0)}
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tamanho da Equipe</label>
                  <Input
                    value={formData.suggestedTeamSize}
                    onChange={(e) => updateFormData("suggestedTeamSize", e.target.value)}
                    placeholder="Ex: 3-5 pessoas"
                  />
                </div>
              </div>
            </div>

            {/* Objectives */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Objetivos</h2>

              <div className="space-y-2">
                {formData.objectives.map((objective, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={objective}
                      onChange={(e) => updateObjective(index, e.target.value)}
                      placeholder="Digite um objetivo..."
                    />
                    <Button variant="outline" size="sm" onClick={() => removeObjective(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="flex items-center space-x-2">
                  <Input
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="Adicionar novo objetivo..."
                    onKeyPress={(e) => e.key === "Enter" && addObjective()}
                  />
                  <Button onClick={addObjective} disabled={!newObjective.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Habilidades Recomendadas</h2>
              <SkillSelector selectedSkills={formData.skills} onChange={(skills) => updateFormData("skills", skills)} />
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Status</h2>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => updateFormData("isActive", e.target.checked)}
                  className="rounded border-white/10"
                />
                <span>Template ativo (visível para usuários)</span>
              </label>
            </div>
          </div>
        </main>
      </div>

      {/* Preview Panel */}
      {showPreview && (
        <div className="w-1/2 border-l border-white/10">
          <TemplatePreview template={formData} />
        </div>
      )}
    </div>
  )
}
