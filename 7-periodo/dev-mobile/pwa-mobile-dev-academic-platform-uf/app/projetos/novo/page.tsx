"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { ProjectForm, ProjectFormData } from "@/components/projects/project-form"

export default function NovoProjeto() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = async (projectData: ProjectFormData) => {
    setIsSubmitting(true)
    
    // Simulação de envio para a API
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Persistir no localStorage para simular persistência
      const savedProjects = localStorage.getItem('user_projects') || '[]'
      const projects = JSON.parse(savedProjects)
      
      const newProject = {
        id: `proj-${Date.now()}`,
        ...projectData,
        status: 'Em andamento',
        progress: 0
      }
      
      projects.push(newProject)
      localStorage.setItem('user_projects', JSON.stringify(projects))
      
      toast.success('Projeto criado com sucesso!')
      router.push('/projetos')
    } catch (error) {
      console.error(error)
      toast.error('Erro ao criar projeto')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="flex min-h-screen flex-col px-4 py-6">
      <header className="mb-6 flex items-center">
        <Link href="/projetos" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-bold">Novo Projeto</h1>
      </header>
      
      <div className="space-y-6">
        <ProjectForm
          onSubmit={handleSubmit}
          onCancel={() => router.push('/projetos')}
          submitLabel="Criar Projeto"
          cancelLabel="Cancelar"
          isLoading={isSubmitting}
        />
      </div>
    </div>
  )
}
