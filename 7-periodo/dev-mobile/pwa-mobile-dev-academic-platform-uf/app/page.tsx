"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input, PasswordInput } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/stores/auth-store"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showDemoUsers, setShowDemoUsers] = useState(false)
  const router = useRouter()
  const login = useAuthStore((state) => state.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        toast.success("Login realizado com sucesso!")
        router.push("/home")
      } else {
        toast.error("Email ou senha inválidos")
      }
    } catch (error) {
      toast.error("Erro ao fazer login")
    } finally {
      setIsLoading(false)
    }
  }

  const demoUsers = [
    { email: "admin@mail.com", name: "Administrador", role: "Admin" },
    { email: "luis@mail.com", name: "Luís Gabriel", role: "Estudante" },
    { email: "luisprof@mail.com", name: "Prof. Luís", role: "Professor" },
  ]

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword("demo123")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mb-6">
            <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
              <span className="text-xl font-bold">UF</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold">Bem-vindo!</h1>
          <p className="text-gray-400">Acesse sua conta</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm text-gray-400">
              Endereço de Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu email aqui..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-gray-400">
              Senha
            </label>
            <PasswordInput
              id="password"
              placeholder="Digite sua senha aqui..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowDemoUsers(!showDemoUsers)}
              className="text-sm text-gray-400 hover:text-white"
            >
              {showDemoUsers ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
              Usuários Demo
            </Button>

            <Button type="submit" size="lg" className="px-8" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </div>
        </form>

        {showDemoUsers && (
          <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-4">
            <h3 className="text-sm font-medium text-gray-300">Usuários de Demonstração:</h3>
            <div className="space-y-2">
              {demoUsers.map((user) => (
                <button
                  key={user.email}
                  onClick={() => handleDemoLogin(user.email)}
                  className="w-full rounded-md border border-white/10 bg-white/5 p-3 text-left text-sm transition-colors hover:bg-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs text-blue-400">{user.role}</span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500">Clique em qualquer usuário para fazer login automaticamente</p>
          </div>
        )}

        <div className="text-center">
          <Link href="/cadastro" className="text-sm text-gray-400 hover:text-white">
            Precisa de ajuda? Entre em contato
          </Link>
        </div>
      </div>
    </div>
  )
}
