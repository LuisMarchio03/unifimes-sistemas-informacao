import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, Mail, Phone } from "lucide-react"

export default function CadastroPage() {
  return (
    <div className="flex min-h-screen flex-col px-4 py-6">
      <header className="mb-6 flex items-center">
        <Link href="/" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-bold">Informações de Contato</h1>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <div className="text-center space-y-4">
          <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
            <Users className="h-10 w-10" />
          </div>

          <h2 className="text-2xl font-bold">Sistema de Usuários Fixos</h2>
          <p className="text-gray-400 max-w-md">
            Este sistema utiliza usuários pré-definidos. Para solicitar acesso ou obter credenciais, entre em contato
            com a administração.
          </p>
        </div>

        <div className="w-full max-w-md space-y-4">
          <div className="rounded-lg border border-white/10 bg-white/5 p-6 space-y-4">
            <h3 className="text-lg font-semibold">Como obter acesso:</h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-400">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Entre em contato</p>
                  <p className="text-xs text-gray-400">Solicite credenciais através dos canais oficiais</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-green-400">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Aguarde aprovação</p>
                  <p className="text-xs text-gray-400">Sua solicitação será analisada pela administração</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-orange-400">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Receba suas credenciais</p>
                  <p className="text-xs text-gray-400">Use as credenciais fornecidas para acessar o sistema</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button variant="outline" className="w-full" asChild>
              <a href="mailto:admin@unifimes.edu.br" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                admin@unifimes.edu.br
              </a>
            </Button>

            <Button variant="outline" className="w-full" asChild>
              <a href="tel:+556434711000" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                (64) 3471-1000
              </a>
            </Button>
          </div>

          <div className="pt-4">
            <Button asChild className="w-full">
              <Link href="/">Voltar ao Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
