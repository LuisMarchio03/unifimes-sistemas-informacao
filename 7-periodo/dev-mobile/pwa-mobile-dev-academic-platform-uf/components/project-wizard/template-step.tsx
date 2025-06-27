"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { BookOpen, Lightbulb, Users, Zap, Code, Palette, Database } from "lucide-react"
import type { ProjectData } from "@/app/projetos/wizard/page"

interface ProjectTemplate {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: string
  estimatedHours: number
  suggestedTeamSize: string
  objectives: string[]
  skills: string[]
}

const templates: ProjectTemplate[] = [
  {
    id: "research",
    name: "Projeto de Pesquisa",
    description: "Investigação científica com metodologia acadêmica",
    icon: <BookOpen className="h-6 w-6" />,
    category: "Pesquisa",
    estimatedHours: 120,
    suggestedTeamSize: "3-5 pessoas",
    objectives: [
      "Realizar revisão bibliográfica",
      "Definir metodologia de pesquisa",
      "Coletar e analisar dados",
      "Produzir artigo científico",
    ],
    skills: ["Metodologia Científica", "Análise de Dados", "Redação Acadêmica"],
  },
  {
    id: "extension",
    name: "Projeto de Extensão",
    description: "Ação social com impacto na comunidade",
    icon: <Users className="h-6 w-6" />,
    category: "Extensão",
    estimatedHours: 80,
    suggestedTeamSize: "4-8 pessoas",
    objectives: [
      "Identificar demanda social",
      "Desenvolver ação comunitária",
      "Executar atividades de extensão",
      "Avaliar impacto social",
    ],
    skills: ["Gestão Social", "Comunicação", "Trabalho em Equipe"],
  },
  {
    id: "innovation",
    name: "Projeto de Inovação",
    description: "Desenvolvimento de soluções inovadoras",
    icon: <Lightbulb className="h-6 w-6" />,
    category: "Inovação",
    estimatedHours: 160,
    suggestedTeamSize: "3-6 pessoas",
    objectives: ["Identificar oportunidade de inovação", "Desenvolver protótipo", "Testar solução", "Validar mercado"],
    skills: ["Design Thinking", "Prototipagem", "Empreendedorismo"],
  },
  {
    id: "software",
    name: "Desenvolvimento de Software",
    description: "Criação de aplicações e sistemas",
    icon: <Code className="h-6 w-6" />,
    category: "Tecnologia",
    estimatedHours: 200,
    suggestedTeamSize: "4-7 pessoas",
    objectives: [
      "Definir requisitos do sistema",
      "Desenvolver arquitetura",
      "Implementar funcionalidades",
      "Realizar testes e deploy",
    ],
    skills: ["Programação", "Banco de Dados", "UI/UX Design", "DevOps"],
  },
  {
    id: "design",
    name: "Projeto de Design",
    description: "Criação de identidade visual e experiência",
    icon: <Palette className="h-6 w-6" />,
    category: "Design",
    estimatedHours: 100,
    suggestedTeamSize: "2-4 pessoas",
    objectives: [
      "Pesquisar referências visuais",
      "Criar identidade visual",
      "Desenvolver materiais gráficos",
      "Entregar manual de marca",
    ],
    skills: ["Design Gráfico", "Branding", "Ilustração", "Fotografia"],
  },
  {
    id: "data",
    name: "Análise de Dados",
    description: "Processamento e análise de grandes volumes de dados",
    icon: <Database className="h-6 w-6" />,
    category: "Dados",
    estimatedHours: 140,
    suggestedTeamSize: "3-5 pessoas",
    objectives: [
      "Coletar e limpar dados",
      "Realizar análise exploratória",
      "Aplicar modelos estatísticos",
      "Criar visualizações e relatórios",
    ],
    skills: ["Python/R", "Estatística", "Machine Learning", "Visualização"],
  },
]

interface TemplateStepProps {
  data: ProjectData
  onUpdate: (data: Partial<ProjectData>) => void
  onValidation: (isValid: boolean) => void
}

export function ProjectTemplateStep({ data, onUpdate, onValidation }: TemplateStepProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(data.template)

  useEffect(() => {
    onValidation(!!selectedTemplate)
  }, [selectedTemplate, onValidation])

  const handleTemplateSelect = (template: ProjectTemplate) => {
    setSelectedTemplate(template.id)
    onUpdate({
      template: template.id,
      category: template.category,
      hours: template.estimatedHours,
      objectives: template.objectives,
      skills: template.skills,
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Escolha um Modelo</h2>
        <p className="text-gray-400">
          Selecione um modelo que melhor se adequa ao seu projeto. Você poderá personalizar todos os detalhes nas
          próximas etapas.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => handleTemplateSelect(template)}
            className={`rounded-lg border p-6 text-left transition-all hover:bg-white/5 ${
              selectedTemplate === template.id ? "border-primary bg-primary/10" : "border-white/10 bg-white/5"
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`rounded-lg p-2 ${selectedTemplate === template.id ? "bg-primary" : "bg-white/10"}`}>
                  {template.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{template.name}</h3>
                  <span className="text-xs text-gray-400">{template.category}</span>
                </div>
              </div>
              {selectedTemplate === template.id && (
                <div className="rounded-full bg-primary p-1">
                  <Zap className="h-4 w-4" />
                </div>
              )}
            </div>

            <p className="mb-4 text-sm text-gray-300">{template.description}</p>

            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Duração estimada:</span>
                <span>{template.estimatedHours}h</span>
              </div>
              <div className="flex justify-between">
                <span>Equipe sugerida:</span>
                <span>{template.suggestedTeamSize}</span>
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-xs font-medium text-gray-400">Principais objetivos:</p>
              <ul className="space-y-1">
                {template.objectives.slice(0, 2).map((objective, index) => (
                  <li key={index} className="text-xs text-gray-300">
                    • {objective}
                  </li>
                ))}
                {template.objectives.length > 2 && (
                  <li className="text-xs text-gray-400">+ {template.objectives.length - 2} outros objetivos</li>
                )}
              </ul>
            </div>
          </button>
        ))}
      </div>

      {selectedTemplate && (
        <div className="rounded-lg border border-success/20 bg-success/10 p-4">
          <h4 className="mb-2 font-semibold text-success">Modelo Selecionado</h4>
          <p className="text-sm text-gray-300">
            {templates.find((t) => t.id === selectedTemplate)?.name} - Este modelo será usado como base para seu
            projeto. Você poderá personalizar todos os detalhes nas próximas etapas.
          </p>
        </div>
      )}
    </div>
  )
}
