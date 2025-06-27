"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Send, Clock, Star } from "lucide-react"

interface ProjectApplicationModalProps {
  project: {
    id: string
    title: string
    description: string
    duration: string
    technologies: string[]
    difficulty: string
  }
  isOpen: boolean
  onClose: () => void
  onSubmit: (application: ApplicationData) => void
}

interface ApplicationData {
  projectId: string
  coverLetter: string
  experience: string
  availability: string
  portfolio: string
  motivation: string
}

export function ProjectApplicationModal({ project, isOpen, onClose, onSubmit }: ProjectApplicationModalProps) {
  const [application, setApplication] = useState<ApplicationData>({
    projectId: project.id,
    coverLetter: "",
    experience: "",
    availability: "",
    portfolio: "",
    motivation: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    onSubmit(application)
    setIsSubmitting(false)
    onClose()

    // Reset form
    setApplication({
      projectId: project.id,
      coverLetter: "",
      experience: "",
      availability: "",
      portfolio: "",
      motivation: "",
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg border border-white/10 bg-black/90 backdrop-blur-sm">
        <div className="border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Candidatar-se ao Projeto</h2>
              <p className="text-sm text-gray-400">{project.title}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6">
          {/* Project Summary */}
          <div className="mb-6 rounded-lg bg-white/5 p-4">
            <h3 className="mb-2 font-semibold">Resumo do Projeto</h3>
            <p className="mb-3 text-sm text-gray-300">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                {project.duration}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Star className="h-3 w-3" />
                {project.difficulty}
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {project.technologies.map((tech, index) => (
                <span key={index} className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                  {tech}
                </span>
              ))}
            </div>
            <div className="mt-3 text-xs text-gray-400">
              <p>Ao se candidatar, você concorda em participar ativamente do projeto e seguir as diretrizes estabelecidas.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="cover-letter" className="mb-1 block text-sm text-gray-400">
                Carta de Apresentação *
              </label>
              <Textarea
                id="cover-letter"
                value={application.coverLetter}
                onChange={(e) => setApplication({ ...application, coverLetter: e.target.value })}
                placeholder="Conte-nos por que você é o candidato ideal para este projeto..."
                className="min-h-[100px] border-white/10 bg-black/80"
                required
              />
            </div>

            <div>
              <label htmlFor="experience" className="mb-1 block text-sm text-gray-400">
                Experiência Relevante *
              </label>
              <Textarea
                id="experience"
                value={application.experience}
                onChange={(e) => setApplication({ ...application, experience: e.target.value })}
                placeholder="Descreva sua experiência com as tecnologias e conceitos deste projeto..."
                className="min-h-[80px] border-white/10 bg-black/80"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="availability" className="mb-1 block text-sm text-gray-400">
                  Disponibilidade *
                </label>
                <Input
                  id="availability"
                  value={application.availability}
                  onChange={(e) => setApplication({ ...application, availability: e.target.value })}
                  placeholder="Ex: 20h/semana"
                  className="border-white/10"
                  required
                />
              </div>

              <div>
                <label htmlFor="portfolio" className="mb-1 block text-sm text-gray-400">
                  Portfolio/GitHub
                </label>
                <Input
                  id="portfolio"
                  value={application.portfolio}
                  onChange={(e) => setApplication({ ...application, portfolio: e.target.value })}
                  placeholder="https://github.com/seu-usuario"
                  className="border-white/10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="motivation" className="mb-1 block text-sm text-gray-400">
                Motivação
              </label>
              <Textarea
                id="motivation"
                value={application.motivation}
                onChange={(e) => setApplication({ ...application, motivation: e.target.value })}
                placeholder="O que te motiva a participar deste projeto?"
                className="min-h-[60px] border-white/10 bg-black/80"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  "Enviando..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Candidatura
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
