"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const suggestedSkills = [
  "JavaScript",
  "Python",
  "React",
  "Node.js",
  "Design Thinking",
  "UI/UX Design",
  "Metodologia Científica",
  "Análise de Dados",
  "Gestão de Projetos",
  "Marketing Digital",
  "Redação Acadêmica",
  "Estatística",
  "Machine Learning",
  "Banco de Dados",
  "DevOps",
  "Prototipagem",
  "Empreendedorismo",
  "Comunicação",
  "Liderança",
  "Trabalho em Equipe",
  "Criatividade",
  "Resolução de Problemas",
]

interface SkillSelectorProps {
  selectedSkills: string[]
  onChange: (skills: string[]) => void
}

export function SkillSelector({ selectedSkills, onChange }: SkillSelectorProps) {
  const [newSkill, setNewSkill] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const addSkill = (skill: string) => {
    if (skill.trim() && !selectedSkills.includes(skill.trim())) {
      onChange([...selectedSkills, skill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    onChange(selectedSkills.filter((skill) => skill !== skillToRemove))
  }

  const filteredSuggestions = suggestedSkills.filter(
    (skill) => skill.toLowerCase().includes(newSkill.toLowerCase()) && !selectedSkills.includes(skill),
  )

  return (
    <div className="space-y-4">
      {/* Selected Skills */}
      <div className="flex flex-wrap gap-2">
        {selectedSkills.map((skill) => (
          <span key={skill} className="flex items-center space-x-1 rounded bg-primary/20 px-2 py-1 text-sm">
            <span>{skill}</span>
            <button onClick={() => removeSkill(skill)} className="text-primary/70 hover:text-primary">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>

      {/* Add New Skill */}
      <div className="relative">
        <div className="flex space-x-2">
          <Input
            value={newSkill}
            onChange={(e) => {
              setNewSkill(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Adicionar habilidade..."
            onKeyPress={(e) => e.key === "Enter" && addSkill(newSkill)}
          />
          <Button onClick={() => addSkill(newSkill)} disabled={!newSkill.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Suggestions */}
        {showSuggestions && newSkill && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-md border border-white/10 bg-black/90 backdrop-blur-sm">
            <div className="max-h-40 overflow-y-auto p-2">
              {filteredSuggestions.slice(0, 8).map((skill) => (
                <button
                  key={skill}
                  onClick={() => addSkill(skill)}
                  className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-white/10"
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Add Suggestions */}
      <div>
        <p className="mb-2 text-sm text-gray-400">Sugestões populares:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedSkills
            .filter((skill) => !selectedSkills.includes(skill))
            .slice(0, 6)
            .map((skill) => (
              <button
                key={skill}
                onClick={() => addSkill(skill)}
                className="rounded border border-white/10 px-2 py-1 text-xs hover:bg-white/5"
              >
                + {skill}
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}
