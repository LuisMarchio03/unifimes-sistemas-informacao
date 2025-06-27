"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { toast } from "sonner"

interface AddGoalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGoalAdded: (goal: any) => void
}

export function AddGoalModal({ open, onOpenChange, onGoalAdded }: AddGoalModalProps) {
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target: "",
    current: "0",
    deadline: "",
    priority: "",
    category: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const getCategories = () => {
    if (user?.role === "admin") {
      return [
        { value: "gestao", label: "Gestão" },
        { value: "eficiencia", label: "Eficiência" },
        { value: "treinamento", label: "Treinamento" },
        { value: "tecnologia", label: "Tecnologia" },
      ]
    } else if (user?.role === "professor") {
      return [
        { value: "orientacao", label: "Orientação" },
        { value: "pesquisa", label: "Pesquisa" },
        { value: "extensao", label: "Extensão" },
        { value: "capacitacao", label: "Capacitação" },
      ]
    } else {
      return [
        { value: "academico", label: "Acadêmico" },
        { value: "projetos", label: "Projetos" },
        { value: "aprendizado", label: "Aprendizado" },
        { value: "competicao", label: "Competição" },
      ]
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "O título é obrigatório"
    }
    
    if (!formData.target) {
      newErrors.target = "A meta é obrigatória"
    } else if (isNaN(Number(formData.target)) || Number(formData.target) <= 0) {
      newErrors.target = "A meta deve ser um número positivo"
    }
    
    if (!formData.deadline) {
      newErrors.deadline = "O prazo é obrigatório"
    }
    
    if (!formData.priority) {
      newErrors.priority = "A prioridade é obrigatória"
    }
    
    if (!formData.category) {
      newErrors.category = "A categoria é obrigatória"
    }
    
    if (formData.current && (isNaN(Number(formData.current)) || Number(formData.current) < 0)) {
      newErrors.current = "O progresso atual deve ser um número não negativo"
    }
    
    if (formData.current && formData.target && Number(formData.current) > Number(formData.target)) {
      newErrors.current = "O progresso atual não pode ser maior que a meta"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Por favor, corrija os erros no formulário")
      return
    }
    
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Here you would normally save to your backend
      console.log("New goal:", {
        ...formData,
        userId: user?.id,
        createdAt: new Date().toISOString(),
        progress: 0,
        current: 0,
      })

      toast.success("Meta criada com sucesso!")
      onGoalAdded({
        ...formData,
        userId: user?.id,
        createdAt: new Date().toISOString(),
        progress: 0,
        current: 0,
      })
      onOpenChange(false)

      // Reset form
      setFormData({
        title: "",
        description: "",
        target: "",
        deadline: "",
        priority: "",
        current: "0",
        category: "",
      })
    } catch (error) {
      toast.error("Erro ao criar meta")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nova Meta
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título da Meta</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Digite o título da meta"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva sua meta"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">Meta (Número)</Label>
              <Input
                id="target"
                type="number"
                min="1"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                placeholder="Ex: 100"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Prazo</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {getCategories().map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Prioridade</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Criando..." : "Criar Meta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
