"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  Filter,
  X,
  Calendar,
  Clock,
  Users,
  Star,
  MapPin,
  GraduationCap,
  Code,
  Palette,
  Database,
  Smartphone,
  Brain,
  Shield,
} from "lucide-react"

interface FilterOptions {
  search: string
  categories: string[]
  skills: string[]
  location: string
  university: string
  course: string
  semester: number[]
  experience: string
  availability: number[]
  projectType: string[]
  teamSize: number[]
  duration: string
  status: string[]
  rating: number[]
  dateRange: {
    start: string
    end: string
  }
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void
  onReset: () => void
  initialFilters?: Partial<FilterOptions>
}

const categories = [
  { id: "desenvolvimento", label: "Desenvolvimento", icon: Code, color: "text-blue-500" },
  { id: "design", label: "Design", icon: Palette, color: "text-purple-500" },
  { id: "dados", label: "Ciência de Dados", icon: Database, color: "text-green-500" },
  { id: "mobile", label: "Mobile", icon: Smartphone, color: "text-orange-500" },
  { id: "ia", label: "Inteligência Artificial", icon: Brain, color: "text-red-500" },
  { id: "seguranca", label: "Segurança", icon: Shield, color: "text-yellow-500" },
]

const skills = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "JavaScript",
  "HTML/CSS",
  "Vue.js",
  "Angular",
  "Flutter",
  "React Native",
  "Swift",
  "Kotlin",
  "PHP",
  "Ruby",
  "Go",
  "Rust",
  "C#",
  ".NET",
  "Django",
  "Flask",
  "Spring",
  "Laravel",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "GCP",
  "Git",
  "Jenkins",
  "CI/CD",
  "Linux",
  "Windows",
  "macOS",
  "Figma",
  "Adobe XD",
  "Sketch",
  "Photoshop",
  "Illustrator",
  "UI/UX",
  "Design Thinking",
  "Machine Learning",
  "Deep Learning",
  "Data Analysis",
  "Statistics",
  "TensorFlow",
  "PyTorch",
  "Pandas",
  "NumPy",
  "R",
  "Tableau",
  "Power BI",
]

const universities = ["UNIFIMES", "UFG", "PUC-GO", "UEG", "IFGOIANO", "IFG", "UniEVANGÉLICA"]

const courses = [
  "Ciência da Computação",
  "Sistemas de Informação",
  "Engenharia de Software",
  "Engenharia da Computação",
  "Análise e Desenvolvimento de Sistemas",
  "Design Gráfico",
  "Design Digital",
  "Arquitetura e Urbanismo",
  "Administração",
  "Engenharia de Produção",
  "Marketing",
  "Psicologia",
]

export function AdvancedFilters({ onFiltersChange, onReset, initialFilters = {} }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    categories: [],
    skills: [],
    location: "",
    university: "",
    course: "",
    semester: [1, 8],
    experience: "",
    availability: [10, 40],
    projectType: [],
    teamSize: [2, 20],
    duration: "",
    status: [],
    rating: [0, 5],
    dateRange: {
      start: "",
      end: "",
    },
    ...initialFilters,
  })

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const toggleArrayFilter = (key: keyof FilterOptions, value: string) => {
    const currentArray = filters[key] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]
    updateFilter(key, newArray)
  }

  const resetFilters = () => {
    const defaultFilters: FilterOptions = {
      search: "",
      categories: [],
      skills: [],
      location: "",
      university: "",
      course: "",
      semester: [1, 8],
      experience: "",
      availability: [10, 40],
      projectType: [],
      teamSize: [2, 20],
      duration: "",
      status: [],
      rating: [0, 5],
      dateRange: {
        start: "",
        end: "",
      },
    }
    setFilters(defaultFilters)
    onFiltersChange(defaultFilters)
    onReset()
  }

  const hasActiveFilters = () => {
    return (
      filters.search !== "" ||
      filters.categories.length > 0 ||
      filters.skills.length > 0 ||
      filters.location !== "" ||
      filters.university !== "" ||
      filters.course !== "" ||
      filters.semester[0] !== 1 ||
      filters.semester[1] !== 8 ||
      filters.experience !== "" ||
      filters.availability[0] !== 10 ||
      filters.availability[1] !== 40 ||
      filters.projectType.length > 0 ||
      filters.teamSize[0] !== 2 ||
      filters.teamSize[1] !== 20 ||
      filters.duration !== "" ||
      filters.status.length > 0 ||
      filters.rating[0] !== 0 ||
      filters.rating[1] !== 5 ||
      filters.dateRange.start !== "" ||
      filters.dateRange.end !== ""
    )
  }

  if (!isOpen) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className={hasActiveFilters() ? "bg-primary/10 text-primary" : ""}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filtros Avançados
          {hasActiveFilters() && (
            <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-xs text-white">
              {[
                filters.categories.length,
                filters.skills.length,
                filters.projectType.length,
                filters.status.length,
              ].reduce((sum, count) => sum + count, 0)}
            </span>
          )}
        </Button>
        {hasActiveFilters() && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Limpar
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filtros Avançados</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Limpar Tudo
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="mb-2 block text-sm font-medium">Busca Geral</label>
          <Input
            placeholder="Buscar por nome, descrição, habilidades..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="border-white/10"
          />
        </div>

        {/* Categories */}
        <div>
          <label className="mb-3 block text-sm font-medium">Categorias</label>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => toggleArrayFilter("categories", category.id)}
                className={`flex items-center gap-2 rounded-lg border p-3 text-left transition-colors ${
                  filters.categories.includes(category.id)
                    ? "border-primary bg-primary/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <category.icon className={`h-4 w-4 ${category.color}`} />
                <span className="text-sm">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="mb-3 block text-sm font-medium">Habilidades</label>
          <div className="mb-2">
            <Input placeholder="Buscar habilidades..." className="border-white/10" />
          </div>
          <div className="max-h-40 overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 20).map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleArrayFilter("skills", skill)}
                  className={`rounded-full px-3 py-1 text-sm transition-colors ${
                    filters.skills.includes(skill) ? "bg-primary text-white" : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
          {filters.skills.length > 0 && (
            <div className="mt-2">
              <p className="mb-1 text-xs text-gray-400">Selecionadas:</p>
              <div className="flex flex-wrap gap-1">
                {filters.skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs text-white"
                  >
                    {skill}
                    <button onClick={() => toggleArrayFilter("skills", skill)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Location and Academic Info */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              <MapPin className="mr-1 inline-block h-4 w-4" />
              Localização
            </label>
            <Input
              placeholder="Cidade, Estado"
              value={filters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
              className="border-white/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              <GraduationCap className="mr-1 inline-block h-4 w-4" />
              Universidade
            </label>
            <select
              value={filters.university}
              onChange={(e) => updateFilter("university", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/80 px-3 py-2"
            >
              <option value="">Todas</option>
              {universities.map((uni) => (
                <option key={uni} value={uni}>
                  {uni}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Curso</label>
            <select
              value={filters.course}
              onChange={(e) => updateFilter("course", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/80 px-3 py-2"
            >
              <option value="">Todos</option>
              {courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Experiência</label>
            <select
              value={filters.experience}
              onChange={(e) => updateFilter("experience", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/80 px-3 py-2"
            >
              <option value="">Qualquer</option>
              <option value="beginner">Iniciante</option>
              <option value="intermediate">Intermediário</option>
              <option value="advanced">Avançado</option>
              <option value="expert">Especialista</option>
            </select>
          </div>
        </div>

        {/* Ranges */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-3 block text-sm font-medium">
              Semestre ({filters.semester[0]}º - {filters.semester[1]}º)
            </label>
            <Slider
              value={filters.semester}
              onValueChange={(value) => updateFilter("semester", value)}
              max={10}
              min={1}
              step={1}
              className="py-2"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium">
              <Clock className="mr-1 inline-block h-4 w-4" />
              Disponibilidade ({filters.availability[0]}h - {filters.availability[1]}h/semana)
            </label>
            <Slider
              value={filters.availability}
              onValueChange={(value) => updateFilter("availability", value)}
              max={60}
              min={5}
              step={5}
              className="py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-3 block text-sm font-medium">
              <Users className="mr-1 inline-block h-4 w-4" />
              Tamanho da Equipe ({filters.teamSize[0]} - {filters.teamSize[1]} membros)
            </label>
            <Slider
              value={filters.teamSize}
              onValueChange={(value) => updateFilter("teamSize", value)}
              max={50}
              min={1}
              step={1}
              className="py-2"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium">
              <Star className="mr-1 inline-block h-4 w-4" />
              Avaliação ({filters.rating[0]} - {filters.rating[1]} estrelas)
            </label>
            <Slider
              value={filters.rating}
              onValueChange={(value) => updateFilter("rating", value)}
              max={5}
              min={0}
              step={0.5}
              className="py-2"
            />
          </div>
        </div>

        {/* Project Type */}
        <div>
          <label className="mb-3 block text-sm font-medium">Tipo de Projeto</label>
          <div className="flex flex-wrap gap-2">
            {["Pesquisa", "Extensão", "Inovação", "TCC", "Iniciação Científica", "Startup"].map((type) => (
              <button
                key={type}
                onClick={() => toggleArrayFilter("projectType", type)}
                className={`rounded-full px-3 py-1 text-sm transition-colors ${
                  filters.projectType.includes(type) ? "bg-primary text-white" : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="mb-3 block text-sm font-medium">Status</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "active", label: "Ativo", color: "bg-green-500" },
              { id: "recruiting", label: "Recrutando", color: "bg-blue-500" },
              { id: "full", label: "Completo", color: "bg-yellow-500" },
              { id: "completed", label: "Concluído", color: "bg-gray-500" },
            ].map((status) => (
              <button
                key={status.id}
                onClick={() => toggleArrayFilter("status", status.id)}
                className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm transition-colors ${
                  filters.status.includes(status.id) ? "bg-primary text-white" : "bg-white/10 hover:bg-white/20"
                }`}
              >
                <div className={`h-2 w-2 rounded-full ${status.color}`} />
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="mb-3 block text-sm font-medium">
            <Calendar className="mr-1 inline-block h-4 w-4" />
            Período
          </label>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-gray-400">Data Inicial</label>
              <Input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => updateFilter("dateRange", { ...filters.dateRange, start: e.target.value })}
                className="border-white/10"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Data Final</label>
              <Input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => updateFilter("dateRange", { ...filters.dateRange, end: e.target.value })}
                className="border-white/10"
              />
            </div>
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="mb-2 block text-sm font-medium">Duração do Projeto</label>
          <select
            value={filters.duration}
            onChange={(e) => updateFilter("duration", e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-black/80 px-3 py-2"
          >
            <option value="">Qualquer duração</option>
            <option value="short">Curto prazo (até 3 meses)</option>
            <option value="medium">Médio prazo (3-6 meses)</option>
            <option value="long">Longo prazo (6+ meses)</option>
            <option value="ongoing">Em andamento</option>
          </select>
        </div>
      </div>

      {/* Apply/Reset Actions */}
      <div className="mt-6 flex gap-3 border-t border-white/10 pt-4">
        <Button variant="outline" onClick={resetFilters} className="flex-1">
          Limpar Filtros
        </Button>
        <Button onClick={() => setIsOpen(false)} className="flex-1">
          Aplicar Filtros
        </Button>
      </div>
    </div>
  )
}
