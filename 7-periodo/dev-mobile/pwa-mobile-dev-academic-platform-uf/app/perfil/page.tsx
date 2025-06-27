"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ProfileForm } from "@/components/profile/profile-form"
import { useProfile } from "@/lib/hooks/use-profile"
import { useAuthStore } from "@/lib/stores/auth-store"
import {
  Bell,
  User,
  Home,
  Briefcase,
  Users,
  Settings,
  Edit,
  Award,
  BookOpen,
  Clock,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Bookmark,
  ChevronRight,
  Github,
  Linkedin,
  Globe,
  Upload,
  ArrowLeft,
} from "lucide-react"

export default function PerfilPage() {
  const { profile, isLoading, isEditing, setIsEditing, updateProfile, updateAvatar } = useProfile()
  const { logout } = useAuthStore()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogout = () => {
    logout()
    router.push('/home') // Redireciona para a página inicial após o logout
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await updateAvatar(file)
    }
  }

  if (isLoading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-white/10 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/home" className="flex items-center text-gray-400 hover:text-white">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-xl font-bold">Perfil</h1>
          </div>
          {/* <div className="flex items-center space-x-4">
            <Link href="/perfil/configuracoes">
              <Settings className="h-6 w-6" />
            </Link>
            <button>
              <Bell className="h-6 w-6" />
            </button>
          </div> */}
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        {isEditing ? (
          <ProfileForm
            profile={profile}
            onSave={updateProfile}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="space-y-6">
            {/* Profile Header */}
            <section className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-xl"></div>
              <div className="relative rounded-lg border border-white/10 bg-black/80 p-6">
                <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-6">
                  <div className="relative mb-4 sm:mb-0">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                    <div
                      onClick={handleAvatarClick}
                      className="group relative h-24 w-24 cursor-pointer overflow-hidden rounded-full"
                    >
                      {profile.avatar ? (
                        <Image
                          src={profile.avatar}
                          alt={profile.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                          <span className="text-3xl font-bold">
                            {profile.name.split(" ").map((n) => n[0]).join("")}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <Upload className="h-6 w-6" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:gap-3">
                      <h2 className="text-2xl font-bold">{profile.name}</h2>
                      <span className="mt-1 inline-block rounded-full bg-blue-500 px-2 py-0.5 text-xs font-medium sm:mt-0">
                        {profile.role}
                      </span>
                    </div>
                    <p className="text-gray-400">
                      {profile.title} • {profile.organization}
                    </p>

                    <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar Perfil
                      </Button>
                      {/* <Button variant="outline" size="sm">
                        <Award className="mr-2 h-4 w-4" />
                        Certificados ({profile.certificates.length})
                      </Button> */}
                      <Button variant="outline" size="sm" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="rounded-lg bg-white/5 p-4">
              <h2 className="mb-4 text-lg font-semibold">Informações de Contato</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p>{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Telefone</p>
                    <p>{profile.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Localização</p>
                    <p>{profile.location}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Bio */}
            <section className="rounded-lg bg-white/5 p-4">
              <h2 className="mb-4 text-lg font-semibold">Sobre</h2>
              <p className="text-gray-300">{profile.bio}</p>
            </section>

            {/* Skills */}
            <section className="rounded-lg bg-white/5 p-4">
              <h2 className="mb-4 text-lg font-semibold">Habilidades</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-white/10 px-3 py-1 text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Education */}
            <section className="rounded-lg bg-white/5 p-4">
              <h2 className="mb-4 text-lg font-semibold">Educação</h2>
              <div className="space-y-4">
                {profile.education.map((edu, index) => (
                  <div
                    key={index}
                    className="flex flex-col rounded-lg border border-white/10 p-4"
                  >
                    <h3 className="font-medium">{edu.institution}</h3>
                    <p className="text-gray-400">{edu.course}</p>
                    <p className="text-sm text-gray-500">
                      {edu.startYear} - {edu.endYear || "Presente"}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Social Links */}
            <section className="rounded-lg bg-white/5 p-4">
              <h2 className="mb-4 text-lg font-semibold">Redes Sociais</h2>
              <div className="space-y-3">
                {profile.socialLinks.github && (
                  <a
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-400 hover:text-white"
                  >
                    <Github className="h-5 w-5" />
                    <span>GitHub</span>
                  </a>
                )}
                {profile.socialLinks.linkedin && (
                  <a
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-400 hover:text-white"
                  >
                    <Linkedin className="h-5 w-5" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {profile.socialLinks.website && (
                  <a
                    href={profile.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-400 hover:text-white"
                  >
                    <Globe className="h-5 w-5" />
                    <span>Website</span>
                  </a>
                )}
              </div>
            </section>
          </div>
        )}
      </main>
      
      {/* Botão de navegação flutuante para retornar à página inicial */}
      <div className="fixed bottom-6 right-6">
        <Link href="/home">
          <Button variant="default" size="icon" className="h-12 w-12 rounded-full shadow-lg">
            <Home className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
