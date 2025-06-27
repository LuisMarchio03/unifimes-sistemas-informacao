"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UserSelector } from "@/components/user-assignment"
import { X, Plus, Minus } from "lucide-react"
import { ProjectDifficulty, ProjectLocation } from "@/lib/types/project"

export interface ProjectFormData {
  title: string
  description: string
  objectives: string[]
  duration: string
  maxParticipants: number
  difficulty: ProjectDifficulty
  technologies: string[]
  location: ProjectLocation
  deadline: string
  requirements: string
  teamMembers: string[]
}

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData>
  onSubmit: (project: ProjectFormData) => void
  onCancel?: () => void
  submitLabel?: string
  cancelLabel?: string
  isLoading?: boolean
}

const defaultProjectData: ProjectFormData = {
  title: "",
  description: "",
  objectives: [""],
  duration: "",
  maxParticipants: 5,
  difficulty: "Intermediário",
  technologies: [],
  location: "Remoto",
  deadline: "",
  requirements: "",
  teamMembers: [],
}

export function ProjectForm({
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = "Criar Projeto",
  cancelLabel = "Cancelar",
  isLoading = false
}: ProjectFormProps) {
  const [project, setProject] = useState<ProjectFormData>({
    ...defaultProjectData,
    ...initialData
  })
  const [newTechnology, setNewTechnology] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(project)
  }

  const addObjective = () => {
    setProject({ ...project, objectives: [...project.objectives, ""] })
  }

  const removeObjective = (index: number) => {
    setProject({
      ...project,
      objectives: project.objectives.filter((_, i) => i !== index),
    })
  }

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...project.objectives]
    newObjectives[index] = value
    setProject({ ...project, objectives: newObjectives })
  }

  const addTechnology = () => {
    if (newTechnology.trim() && !project.technologies.includes(newTechnology.trim())) {
      setProject({
        ...project,
        technologies: [...project.technologies, newTechnology.trim()],
      })
      setNewTechnology("")
    }
  }

  const removeTechnology = (tech: string) => {
    setProject({
      ...project,
      technologies: project.technologies.filter((t) => t !== tech),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Informações Básicas</h3>

        <div>
          <label htmlFor="title" className="mb-1 block text-sm text-gray-400">
            Título do Projeto *
          </label>
          <Input
            id="title"
            value={project.title}
            onChange={(e) => setProject({ ...project, title: e.target.value })}
            placeholder="Ex: Sistema de Gestão Acadêmica"
            className="border-white/10"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm text-gray-400">
            Descrição *
          </label>
          <Textarea
            id="description"
            value={project.description}
            onChange={(e) => setProject({ ...project, description: e.target.value })}
            placeholder="Descreva o projeto em detalhes..."
            className="min-h-[100px] border-white/10 bg-black/80"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-400">
            Objetivos *
          </label>
          <div className="mb-2 space-y-2">
            {project.objectives.map((objective, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={objective}
                  onChange={(e) => updateObjective(index, e.target.value)}
                  placeholder={`Objetivo ${index + 1}`}
                  className="border-white/10 flex-1"
                  required={index === 0}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeObjective(index)}
                  disabled={project.objectives.length <= 1 && index === 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addObjective}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Objetivo
          </Button>
        </div>
      </div>

      {/* Project Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Detalhes do Projeto</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="duration" className="mb-1 block text-sm text-gray-400">
              Duração (em semanas) *
            </label>
            <Input
              id="duration"
              type="number"
              value={project.duration}
              onChange={(e) => setProject({ ...project, duration: e.target.value })}
              placeholder="Ex: 12"
              className="border-white/10"
              required
            />
          </div>

          <div>
            <label htmlFor="maxParticipants" className="mb-1 block text-sm text-gray-400">
              Número Máx. de Participantes *
            </label>
            <Input
              id="maxParticipants"
              type="number"
              value={project.maxParticipants}
              onChange={(e) =>
                setProject({
                  ...project,
                  maxParticipants: parseInt(e.target.value) || 1,
                })
              }
              className="border-white/10"
              min="1"
              required
            />
          </div>

          <div>
            <label htmlFor="difficulty" className="mb-1 block text-sm text-gray-400">
              Nível de Dificuldade *
            </label>
            <select
              id="difficulty"
              value={project.difficulty}
              onChange={(e) =>
                setProject({
                  ...project,
                  difficulty: e.target.value as "Iniciante" | "Intermediário" | "Avançado",
                })
              }
              className="w-full rounded-lg border border-white/10 bg-black/80 px-3 py-2 text-base"
              required
            >
              <option value="Iniciante">Iniciante</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado</option>
            </select>
          </div>

          <div>
            <label htmlFor="location" className="mb-1 block text-sm text-gray-400">
              Modalidade *
            </label>
            <select
              id="location"
              value={project.location}
              onChange={(e) =>
                setProject({
                  ...project,
                  location: e.target.value as "Remoto" | "Presencial" | "Híbrido",
                })
              }
              className="w-full rounded-lg border border-white/10 bg-black/80 px-3 py-2 text-base"
              required
            >
              <option value="Remoto">Remoto</option>
              <option value="Presencial">Presencial</option>
              <option value="Híbrido">Híbrido</option>
            </select>
          </div>

          <div>
            <label htmlFor="deadline" className="mb-1 block text-sm text-gray-400">
              Prazo Final *
            </label>
            <Input
              id="deadline"
              type="date"
              value={project.deadline}
              onChange={(e) => setProject({ ...project, deadline: e.target.value })}
              className="border-white/10"
              required
            />
          </div>
        </div>
      </div>

      {/* Technologies */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Tecnologias</h3>

        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, index) => (
            <div key={index} className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
              <span className="text-sm">{tech}</span>
              <button type="button" onClick={() => removeTechnology(tech)}>
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Adicionar tecnologia..."
            value={newTechnology}
            onChange={(e) => setNewTechnology(e.target.value)}
            className="border-white/10"
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTechnology())}
          />
          <Button type="button" onClick={addTechnology} variant="outline" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Requirements */}
      <div>
        <label htmlFor="requirements" className="mb-1 block text-sm text-gray-400">
          Requisitos e Qualificações
        </label>
        <Textarea
          id="requirements"
          value={project.requirements}
          onChange={(e) => setProject({ ...project, requirements: e.target.value })}
          placeholder="Descreva os requisitos necessários para participar do projeto..."
          className="min-h-[80px] border-white/10 bg-black/80"
        />
      </div>

      {/* Team Members */}
      <div>
        <UserSelector
          selectedUsers={project.teamMembers}
          onChange={(users) => setProject({ ...project, teamMembers: users })}
          label="Membros Iniciais da Equipe"
          placeholder="Selecionar membros"
        />
      </div>

      <div className="flex gap-3 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            {cancelLabel}
          </Button>
        )}
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Processando..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
