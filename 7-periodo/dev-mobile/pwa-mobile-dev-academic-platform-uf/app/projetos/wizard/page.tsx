"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Check, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectTemplateStep } from "@/components/project-wizard/template-step"
import { ProjectBasicInfoStep } from "@/components/project-wizard/basic-info-step"
import { ProjectObjectivesStep } from "@/components/project-wizard/objectives-step"
import { ProjectTeamStep } from "@/components/project-wizard/team-step"
import { ProjectResourcesStep } from "@/components/project-wizard/resources-step"
import { ProjectReviewStep } from "@/components/project-wizard/review-step"

export interface ProjectData {
  template?: string
  title?: string
  description?: string
  type?: string
  category?: string
  startDate?: Date
  endDate?: Date
  objectives?: string[]
  participants?: Array<{ email: string; role: string }>
  skills?: string[]
  hours?: number
  budget?: number
  resources?: string[]
}

const steps = [
  { id: 1, title: "Template", description: "Escolha um modelo" },
  { id: 2, title: "Informações", description: "Dados básicos" },
  { id: 3, title: "Objetivos", description: "Metas e resultados" },
  { id: 4, title: "Equipe", description: "Participantes" },
  { id: 5, title: "Recursos", description: "Cronograma e orçamento" },
  { id: 6, title: "Revisão", description: "Confirmar dados" },
]

export default function ProjectWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [projectData, setProjectData] = useState<ProjectData>({})
  const [isValid, setIsValid] = useState(false)

  const updateProjectData = (data: Partial<ProjectData>) => {
    setProjectData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ProjectTemplateStep data={projectData} onUpdate={updateProjectData} onValidation={setIsValid} />
      case 2:
        return <ProjectBasicInfoStep data={projectData} onUpdate={updateProjectData} onValidation={setIsValid} />
      case 3:
        return <ProjectObjectivesStep data={projectData} onUpdate={updateProjectData} onValidation={setIsValid} />
      case 4:
        return <ProjectTeamStep data={projectData} onUpdate={updateProjectData} onValidation={setIsValid} />
      case 5:
        return <ProjectResourcesStep data={projectData} onUpdate={updateProjectData} onValidation={setIsValid} />
      case 6:
        return <ProjectReviewStep data={projectData} onUpdate={updateProjectData} onValidation={setIsValid} />
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-white/10 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/projetos" className="mr-4">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">Criar Novo Projeto</h1>
              <p className="text-sm text-gray-400">
                Etapa {currentStep} de {steps.length}: {steps[currentStep - 1]?.title}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b border-white/10 px-4 py-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
                    currentStep > step.id
                      ? "border-success bg-success text-white"
                      : currentStep === step.id
                        ? "border-primary bg-primary text-white"
                        : "border-white/20 bg-transparent text-gray-400"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-medium">{step.id}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-xs font-medium">{step.title}</p>
                  <p className="text-xs text-gray-400">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <main className="flex-1 px-4 py-6">
        <div className="mx-auto max-w-2xl">{renderStep()}</div>
      </main>

      {/* Navigation */}
      <footer className="border-t border-white/10 px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>

          <div className="text-sm text-gray-400">
            {currentStep} de {steps.length}
          </div>

          {currentStep === steps.length ? (
            <Button
              onClick={() => {
                // Handle project creation
                console.log("Creating project:", projectData)
              }}
              disabled={!isValid}
              className="flex items-center"
            >
              <Check className="mr-2 h-4 w-4" />
              Criar Projeto
            </Button>
          ) : (
            <Button onClick={nextStep} disabled={!isValid} className="flex items-center">
              Próximo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  )
}
