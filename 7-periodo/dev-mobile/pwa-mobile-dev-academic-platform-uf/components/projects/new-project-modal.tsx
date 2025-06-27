"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { ProjectForm, ProjectFormData } from "./project-form"

interface NewProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (project: ProjectFormData) => void
}

export function NewProjectModal({ isOpen, onClose, onSubmit }: NewProjectModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (projectData: ProjectFormData) => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    onSubmit(projectData)
    setIsSubmitting(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl rounded-lg border border-white/10 bg-black/90 backdrop-blur-sm">
        <div className="border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Criar Novo Projeto</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="max-h-[80vh] overflow-y-auto p-6">
          <ProjectForm
            onSubmit={handleSubmit}
            onCancel={onClose}
            submitLabel="Criar Projeto"
            cancelLabel="Cancelar"
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </div>
  )
}
