"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CollaborativeEditor } from "./collaborative-editor"
import { FileText, Plus, Users, Clock, Edit3 } from "lucide-react"

interface Document {
  id: string
  title: string
  lastModified: number
  collaborators: string[]
  isActive: boolean
}

const mockDocuments: Document[] = [
  {
    id: "doc1",
    title: "Especificação do Projeto",
    lastModified: Date.now() - 300000, // 5 minutes ago
    collaborators: ["user1", "user2", "user3"],
    isActive: true,
  },
  {
    id: "doc2",
    title: "Documentação da API",
    lastModified: Date.now() - 1800000, // 30 minutes ago
    collaborators: ["user1", "user4"],
    isActive: false,
  },
  {
    id: "doc3",
    title: "Notas da Reunião",
    lastModified: Date.now() - 3600000, // 1 hour ago
    collaborators: ["user2", "user3", "user4", "user5"],
    isActive: true,
  },
]

export function CollaborativeDocumentList() {
  const [documents, setDocuments] = useState(mockDocuments)
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  const [showNewDocForm, setShowNewDocForm] = useState(false)
  const [newDocTitle, setNewDocTitle] = useState("")

  const handleCreateDocument = () => {
    if (!newDocTitle.trim()) return

    const newDoc: Document = {
      id: crypto.randomUUID(),
      title: newDocTitle,
      lastModified: Date.now(),
      collaborators: ["current_user"],
      isActive: true,
    }

    setDocuments([newDoc, ...documents])
    setNewDocTitle("")
    setShowNewDocForm(false)
    setSelectedDocument(newDoc.id)
  }

  const formatLastModified = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Agora mesmo"
    if (minutes < 60) return `${minutes}m atrás`
    if (hours < 24) return `${hours}h atrás`
    return `${days}d atrás`
  }

  if (selectedDocument) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setSelectedDocument(null)} className="mb-4">
            ← Voltar aos documentos
          </Button>
        </div>

        <CollaborativeEditor documentId={selectedDocument} userId="current_user" userName="Usuário Atual" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Documentos Colaborativos</h1>
          <p className="text-gray-400">Edite documentos em tempo real com sua equipe</p>
        </div>
        <Button onClick={() => setShowNewDocForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Documento
        </Button>
      </div>

      {/* New document form */}
      {showNewDocForm && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <h3 className="mb-3 font-semibold">Criar Novo Documento</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Título do documento..."
              value={newDocTitle}
              onChange={(e) => setNewDocTitle(e.target.value)}
              className="border-white/10"
              onKeyPress={(e) => e.key === "Enter" && handleCreateDocument()}
            />
            <Button onClick={handleCreateDocument}>Criar</Button>
            <Button variant="outline" onClick={() => setShowNewDocForm(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Documents grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
            onClick={() => setSelectedDocument(doc.id)}
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-400" />
                <h3 className="font-medium">{doc.title}</h3>
              </div>
              {doc.isActive && (
                <div className="flex items-center gap-1">
                  <Edit3 className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">Ativo</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="h-3 w-3" />
                <span>{formatLastModified(doc.lastModified)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="h-3 w-3" />
                <span>{doc.collaborators.length} colaboradores</span>
              </div>

              {/* Collaborator avatars */}
              <div className="flex items-center gap-1">
                {doc.collaborators.slice(0, 3).map((collaborator, index) => (
                  <div
                    key={collaborator}
                    className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-medium"
                    style={{
                      backgroundColor: `hsl(${index * 137.5}, 70%, 50%)`,
                    }}
                  >
                    {collaborator.charAt(0).toUpperCase()}
                  </div>
                ))}
                {doc.collaborators.length > 3 && (
                  <div className="h-6 w-6 rounded-full bg-gray-600 flex items-center justify-center text-xs">
                    +{doc.collaborators.length - 3}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {documents.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum documento encontrado</h3>
          <p className="text-gray-400 mb-4">Crie seu primeiro documento colaborativo</p>
          <Button onClick={() => setShowNewDocForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Documento
          </Button>
        </div>
      )}
    </div>
  )
}
