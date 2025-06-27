"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/stores/auth-store"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showDemoUsers, setShowDemoUsers] = useState(false)
  const router = useRouter()
  const login = useAuthStore?.((state) => state.login)

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
      console.error("Erro no login:", error)
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
    <div className="flex min-h-screen bg-black">
      <div className="w-full lg:w-1/2 p-6 flex flex-col justify-center relative">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-white">UF</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Plataforma Acadêmica</h1>
            <p className="mt-2 text-gray-400">Acesse sua conta para continuar</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="mt-1 block w-full border border-white/20 bg-white/5"
                  placeholder="nome@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                  Senha
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="mt-1 block w-full border border-white/20 bg-white/5"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-blue-600"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  Lembrar de mim
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-500 hover:text-blue-400">
                  Esqueci minha senha
                </a>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </div>
          </form>

          <div>
            <button
              onClick={() => setShowDemoUsers(!showDemoUsers)}
              className="text-sm text-blue-500 hover:text-blue-400 text-center w-full"
            >
              {showDemoUsers ? "Ocultar contas demo" : "Mostrar contas demo"}
            </button>

            {showDemoUsers && (
              <div className="mt-4 space-y-3 bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-sm text-gray-400 text-center">Clique para preencher os dados</p>
                {demoUsers.map((user, index) => (
                  <button
                    key={index}
                    onClick={() => handleDemoLogin(user.email)}
                    className="flex items-center justify-between w-full p-2 hover:bg-white/10 rounded transition"
                  >
                    <span className="text-sm font-medium text-white">{user.name}</span>
                    <span className="text-xs text-gray-400">{user.role}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/placeholder.jpg')",
        }}
      >
        <div className="h-full flex flex-col justify-center text-center px-12">
          <h1 className="text-4xl font-bold text-white mb-4">Bem-vindo à Plataforma Acadêmica</h1>
          <p className="text-xl text-gray-300 mb-8">
            Gerencie projetos acadêmicos, colabore com equipes e acompanhe seu progresso, tudo em um só lugar.
          </p>
          <div className="max-w-md mx-auto flex flex-wrap justify-center gap-2">
            <span className="px-4 py-2 rounded-full bg-white/10 text-gray-300 text-sm">Projetos</span>
            <span className="px-4 py-2 rounded-full bg-white/10 text-gray-300 text-sm">Equipes</span>
            <span className="px-4 py-2 rounded-full bg-white/10 text-gray-300 text-sm">Metas</span>
            <span className="px-4 py-2 rounded-full bg-white/10 text-gray-300 text-sm">Colaboração</span>
          </div>
        </div>
      </div>
    </div>
  )
}
