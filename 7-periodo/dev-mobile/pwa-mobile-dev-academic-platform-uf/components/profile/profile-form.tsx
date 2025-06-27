"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { UserProfile } from "@/lib/services/profile-service"
import { X, Plus } from "lucide-react"

interface ProfileFormProps {
  profile: UserProfile
  onSave: (profile: UserProfile) => void
  onCancel: () => void
}

export function ProfileForm({ profile, onSave, onCancel }: ProfileFormProps) {
  const [formData, setFormData] = useState(profile)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        {
          institution: "",
          course: "",
          startYear: new Date().getFullYear(),
        }
      ]
    })
  }

  const removeEducation = (index: number) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index)
    })
  }

  const updateEducation = (index: number, field: string, value: any) => {
    const newEducation = [...formData.education]
    newEducation[index] = { ...newEducation[index], [field]: value }
    setFormData({ ...formData, education: newEducation })
  }

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] })
    }
  }

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nome completo</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="role">Cargo</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="organization">Organização</Label>
            <Input
              id="organization"
              value={formData.organization}
              onChange={e => setFormData({ ...formData, organization: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="bio">Biografia</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={e => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location">Localização</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={e => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Redes Sociais</Label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="GitHub URL"
              value={formData.socialLinks.github}
              onChange={e => setFormData({
                ...formData,
                socialLinks: { ...formData.socialLinks, github: e.target.value }
              })}
            />
            <Input
              placeholder="LinkedIn URL"
              value={formData.socialLinks.linkedin}
              onChange={e => setFormData({
                ...formData,
                socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
              })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Habilidades</Label>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map(skill => (
              <div key={skill} className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Input
              placeholder="Nova habilidade"
              className="w-32"
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addSkill(e.currentTarget.value)
                  e.currentTarget.value = ''
                }
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Educação</Label>
            <Button type="button" variant="ghost" size="sm" onClick={addEducation}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {formData.education.map((edu, index) => (
              <div key={index} className="relative space-y-2 rounded-lg border border-white/10 p-4">
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="absolute right-2 top-2 text-red-400 hover:text-red-300"
                >
                  <X className="h-4 w-4" />
                </button>
                <Input
                  placeholder="Instituição"
                  value={edu.institution}
                  onChange={e => updateEducation(index, 'institution', e.target.value)}
                />
                <Input
                  placeholder="Curso"
                  value={edu.course}
                  onChange={e => updateEducation(index, 'course', e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Ano início"
                    value={edu.startYear}
                    onChange={e => updateEducation(index, 'startYear', parseInt(e.target.value))}
                  />
                  <Input
                    type="number"
                    placeholder="Ano conclusão"
                    value={edu.endYear}
                    onChange={e => updateEducation(index, 'endYear', parseInt(e.target.value))}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  )
}
