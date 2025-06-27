"use client"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const iconOptions = [
  { name: "BookOpen", label: "Livro" },
  { name: "Users", label: "Usuários" },
  { name: "Lightbulb", label: "Lâmpada" },
  { name: "Code", label: "Código" },
  { name: "Palette", label: "Paleta" },
  { name: "Database", label: "Banco de Dados" },
  { name: "Zap", label: "Raio" },
  { name: "Target", label: "Alvo" },
]

interface IconSelectorProps {
  value: string
  onChange: (icon: string) => void
}

export function IconSelector({ value, onChange }: IconSelectorProps) {
  const selectedIcon = iconOptions.find((icon) => icon.name === value) || iconOptions[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span>{selectedIcon.label}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full">
        <div className="grid grid-cols-2 gap-2 p-2">
          {iconOptions.map((icon) => (
            <button
              key={icon.name}
              onClick={() => onChange(icon.name)}
              className={`rounded p-2 text-left text-sm hover:bg-white/10 ${
                value === icon.name ? "bg-primary/20" : ""
              }`}
            >
              {icon.label}
            </button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
