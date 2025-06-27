"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, X, Upload, Users, Target, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function NovaEquipe() {
  const [teamName, setTeamName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedType, setSelectedType] = useState("desenvolvimento")
  const [goals, setGoals] = useState<string[]>([])
  const [newGoal, setNewGoal] = useState("")
  const [members, setMembers] = useState<string[]>([])
  const [newMember, setNewMember] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [maxMembers, setMaxMembers] = useState("10")

  const teamTypes = [
    { id: "desenvolvimento", label: "Desenvolvimento", color: "from-blue-500 to-purple-500" },
    { id: "pesquisa", label: "Pesquisa", color: "from-green-500 to-teal-500" },
    { id: "design", label: "Design", color: "from-purple-500 to-pink-500" },
    { id: "dados", label: "Ciência de Dados", color: "from-orange-500 to-red-500" },
    { id: "mobile", label: "Mobile", color: "from-yellow-500 to-orange-500" },
    { id: "ia", label: "Inteligência Artificial", color: "from-indigo-500 to-purple-500" },
  ]

  const addGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, newGoal.trim()])
      setNewGoal("")
    }
  }

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index))
  }

  const addMember = () => {
    if (newMember.trim()) {
      setMembers([...members, newMember.trim()])
      setNewMember("")
    }
  }

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index))
  }

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log({
      teamName,
      description,
      selectedType,
      goals,
      members,
      skills,
      isPrivate,
      maxMembers,
    })
  }

  return (
    <div className="flex min-h-screen flex-col px-4 py-6">
      <header className="mb-6 flex items-center">
        <Link href="/equipes" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-bold">Nova Equipe</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <section className="space-y-4 rounded-lg bg-white/5 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Informações Básicas</h2>
          </div>

          {/* Team Avatar */}
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
              <span className="text-xl font-bold">{teamName.slice(0, 2).toUpperCase() || "EQ"}</span>
            </div>
            <div className="flex-1">
              <Button type="button" variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Alterar Logo
              </Button>
              <p className="mt-1 text-xs text-gray-400">Recomendado: 200x200px, PNG ou JPG</p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="teamName" className="text-sm text-gray-400">
              Nome da Equipe *
            </label>
            <Input
              id="teamName"
              placeholder="Ex: Dev Web Masters"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="border-white/10"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm text-gray-400">
              Descrição da Equipe *
            </label>
            <Textarea
              id="description"
              placeholder="Descreva o propósito e objetivos da equipe..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] border-white/10 bg-black/80"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Categoria da Equipe *</label>
            <div className="grid grid-cols-2 gap-2">
              {teamTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    selectedType === type.id
                      ? "border-primary bg-primary/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className={`h-8 w-8 rounded-lg bg-gradient-to-r ${type.color} mb-2`}></div>
                  <p className="text-sm font-medium">{type.label}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Team Goals */}
        <section className="space-y-4 rounded-lg bg-white/5 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Objetivos da Equipe</h2>
          </div>

          <div className="space-y-4">
            {goals.map((goal, index) => (
              <div key={index} className="flex items-start gap-2 rounded-lg bg-white/10 p-3">
                <div className="flex-1">
                  <p className="text-sm">{goal}</p>
                </div>
                <button type="button" onClick={() => removeGoal(index)} className="text-gray-400 hover:text-red-500">
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}

            <div className="flex gap-2">
              <Input
                placeholder="Adicionar objetivo..."
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                className="border-white/10 flex-1"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addGoal())}
              />
              <Button type="button" onClick={addGoal} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Skills and Technologies */}
        <section className="space-y-4 rounded-lg bg-white/5 p-4">
          <h2 className="text-lg font-semibold">Habilidades e Tecnologias</h2>

          <div className="space-y-4">
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                    <span className="text-sm">{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                placeholder="Ex: React, Node.js, Python..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="border-white/10 flex-1"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              />
              <Button type="button" onClick={addSkill} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-xs text-gray-400">
              Adicione as principais tecnologias e habilidades que a equipe irá trabalhar
            </p>
          </div>
        </section>

        {/* Initial Members */}
        <section className="space-y-4 rounded-lg bg-white/5 p-4">
          <h2 className="text-lg font-semibold">Membros Iniciais</h2>
          <p className="text-sm text-gray-400">Convide pessoas para participar da equipe (opcional)</p>

          <div className="space-y-4">
            {members.map((member, index) => (
              <div key={index} className="flex items-center gap-2 rounded-lg bg-white/10 p-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                  {member.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{member}</p>
                  <p className="text-xs text-gray-400">Convite pendente</p>
                </div>
                <button type="button" onClick={() => removeMember(index)} className="text-gray-400 hover:text-red-500">
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}

            <div className="flex gap-2">
              <Input
                placeholder="Email do membro..."
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
                className="border-white/10 flex-1"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addMember())}
              />
              <Button type="button" onClick={addMember} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Team Settings */}
        <section className="space-y-4 rounded-lg bg-white/5 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Configurações da Equipe</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="maxMembers" className="text-sm text-gray-400">
                Número Máximo de Membros
              </label>
              <Input
                id="maxMembers"
                type="number"
                min="2"
                max="50"
                value={maxMembers}
                onChange={(e) => setMaxMembers(e.target.value)}
                className="border-white/10"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-white/10 p-4">
              <div>
                <h3 className="font-medium">Equipe Privada</h3>
                <p className="text-sm text-gray-400">Apenas membros convidados podem participar</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPrivate(!isPrivate)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isPrivate ? "bg-primary" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isPrivate ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="rounded-lg border border-white/10 p-4">
              <h3 className="font-medium mb-2">Permissões dos Membros</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm">Membros podem convidar outros</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm">Membros podem criar projetos</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Membros podem editar informações da equipe</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" className="flex-1" asChild>
            <Link href="/equipes">Cancelar</Link>
          </Button>
          <Button type="submit" className="flex-1">
            Criar Equipe
          </Button>
        </div>
      </form>
    </div>
  )
}
