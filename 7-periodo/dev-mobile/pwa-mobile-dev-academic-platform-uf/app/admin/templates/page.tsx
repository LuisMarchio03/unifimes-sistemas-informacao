"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TemplateCard } from "@/components/admin/template-card"
import { TemplateStats } from "@/components/admin/template-stats"
import { TemplateFilters } from "@/components/admin/template-filters"
import { DeleteTemplateDialog } from "@/components/admin/delete-template-dialog"
import { DuplicateTemplateDialog } from "@/components/admin/duplicate-template-dialog"

interface Template {
  id: string
  name: string
  description: string
  category: string
  icon: string
  estimatedHours: number
  suggestedTeamSize: string
  objectives: string[]
  skills: string[]
  isActive: boolean
  usageCount: number
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

const mockTemplates: Template[] = [
  {
    id: "research",
    name: "Projeto de Pesquisa",
    description: "Investigação científica com metodologia acadêmica",
    category: "Pesquisa",
    icon: "BookOpen",
    estimatedHours: 120,
    suggestedTeamSize: "3-5 pessoas",
    objectives: [
      "Realizar revisão bibliográfica",
      "Definir metodologia de pesquisa",
      "Coletar e analisar dados",
      "Produzir artigo científico",
    ],
    skills: ["Metodologia Científica", "Análise de Dados", "Redação Acadêmica"],
    isActive: true,
    usageCount: 45,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    createdBy: "Admin",
  },
  {
    id: "extension",
    name: "Projeto de Extensão",
    description: "Ação social com impacto na comunidade",
    category: "Extensão",
    icon: "Users",
    estimatedHours: 80,
    suggestedTeamSize: "4-8 pessoas",
    objectives: [
      "Identificar demanda social",
      "Desenvolver ação comunitária",
      "Executar atividades de extensão",
      "Avaliar impacto social",
    ],
    skills: ["Gestão Social", "Comunicação", "Trabalho em Equipe"],
    isActive: true,
    usageCount: 32,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
    createdBy: "Admin",
  },
  {
    id: "innovation",
    name: "Projeto de Inovação",
    description: "Desenvolvimento de soluções inovadoras",
    category: "Inovação",
    icon: "Lightbulb",
    estimatedHours: 160,
    suggestedTeamSize: "3-6 pessoas",
    objectives: ["Identificar oportunidade de inovação", "Desenvolver protótipo", "Testar solução", "Validar mercado"],
    skills: ["Design Thinking", "Prototipagem", "Empreendedorismo"],
    isActive: true,
    usageCount: 28,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-22"),
    createdBy: "Admin",
  },
  {
    id: "software",
    name: "Desenvolvimento de Software",
    description: "Criação de aplicações e sistemas",
    category: "Tecnologia",
    icon: "Code",
    estimatedHours: 200,
    suggestedTeamSize: "4-7 pessoas",
    objectives: [
      "Definir requisitos do sistema",
      "Desenvolver arquitetura",
      "Implementar funcionalidades",
      "Realizar testes e deploy",
    ],
    skills: ["Programação", "Banco de Dados", "UI/UX Design", "DevOps"],
    isActive: true,
    usageCount: 67,
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-25"),
    createdBy: "Admin",
  },
]

export default function AdminTemplates() {
  const [templates, setTemplates] = useState(mockTemplates)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false)

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(templates.map((t) => t.category)))

  const handleDeleteTemplate = (template: Template) => {
    setSelectedTemplate(template)
    setShowDeleteDialog(true)
  }

  const handleDuplicateTemplate = (template: Template) => {
    setSelectedTemplate(template)
    setShowDuplicateDialog(true)
  }

  const confirmDelete = () => {
    if (selectedTemplate) {
      setTemplates(templates.filter((t) => t.id !== selectedTemplate.id))
      setShowDeleteDialog(false)
      setSelectedTemplate(null)
    }
  }

  const confirmDuplicate = (newName: string) => {
    if (selectedTemplate) {
      const newTemplate: Template = {
        ...selectedTemplate,
        id: `${selectedTemplate.id}-copy-${Date.now()}`,
        name: newName,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setTemplates([...templates, newTemplate])
      setShowDuplicateDialog(false)
      setSelectedTemplate(null)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gerenciar Templates</h1>
            <p className="text-gray-400">Administre os modelos de projeto disponíveis na plataforma</p>
          </div>
          <Link href="/admin/templates/novo">
            <Button className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Novo Template
            </Button>
          </Link>
        </div>
      </header>

      {/* Stats */}
      <div className="border-b border-white/10 px-6 py-4">
        <TemplateStats templates={templates} />
      </div>

      {/* Filters and Search */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm"
            >
              <option value="all">Todas as categorias</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
        </div>
        {showFilters && (
          <div className="mt-4">
            <TemplateFilters onFilterChange={() => {}} />
          </div>
        )}
      </div>

      {/* Templates Grid */}
      <main className="flex-1 px-6 py-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? "s" : ""} encontrado
            {filteredTemplates.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onEdit={() => {}}
              onDelete={() => handleDeleteTemplate(template)}
              onDuplicate={() => handleDuplicateTemplate(template)}
              onPreview={() => {}}
              onToggleStatus={() => {}}
            />
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-white/5 p-4 mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhum template encontrado</h3>
            <p className="text-gray-400 text-center max-w-md">
              Não encontramos templates que correspondam aos seus critérios de busca. Tente ajustar os filtros ou criar
              um novo template.
            </p>
            <Link href="/admin/templates/novo" className="mt-4">
              <Button>Criar Novo Template</Button>
            </Link>
          </div>
        )}
      </main>

      {/* Delete Dialog */}
      <DeleteTemplateDialog
        template={selectedTemplate}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
      />

      {/* Duplicate Dialog */}
      <DuplicateTemplateDialog
        template={selectedTemplate}
        open={showDuplicateDialog}
        onOpenChange={setShowDuplicateDialog}
        onConfirm={confirmDuplicate}
      />
    </div>
  )
}
