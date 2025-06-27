import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Search,
  Filter,
  Plus,
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react"

export default function GerenciarProjetosPage() {
  return (
    <div className="flex min-h-screen flex-col px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/projetos" className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Gerenciar Projetos</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-primary/20 bg-primary/10 text-primary">
            Todos
          </Button>
          <Button variant="outline" size="sm">
            Ativos
          </Button>
          <Button variant="outline" size="sm">
            Concluídos
          </Button>
          <Button variant="outline" size="sm">
            Arquivados
          </Button>
        </div>
        <Button size="sm" asChild>
          <Link href="/projetos/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Projeto
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {/* Project Card */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold">Sistema de Gestão Integrada</h2>
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Início: 15/03/2023
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Prazo: 30/11/2023
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-medium">Em andamento</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">React</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">Node.js</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">MongoDB</span>
          </div>

          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="h-6 w-6 rounded-full bg-red-500 border border-black"></div>
                <div className="h-6 w-6 rounded-full bg-blue-500 border border-black"></div>
                <div className="h-6 w-6 rounded-full bg-green-500 border border-black"></div>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 border border-black text-xs">
                  +5
                </div>
              </div>
              <span className="text-xs text-gray-400">8 membros</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                12 tarefas concluídas
              </span>
              <span className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-yellow-500" />4 pendentes
              </span>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Progresso: 75%</span>
              <span>75/100</span>
            </div>
            <div className="mt-1 h-1.5 w-full rounded-full bg-white/10">
              <div className="h-full w-[75%] rounded-full bg-gradient-to-r from-red-500 to-orange-500"></div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href="/projetos/1">Ver Detalhes</Link>
            </Button>
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href="/projetos/1/tarefas">Tarefas</Link>
            </Button>
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href="/projetos/1/kanban">Kanban</Link>
            </Button>
          </div>
        </div>

        {/* Project Card */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold">Aplicativo Educacional</h2>
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Início: 10/04/2023
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Prazo: 15/12/2023
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium">Aberto</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">Flutter</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">Firebase</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">UI/UX</span>
          </div>

          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="h-6 w-6 rounded-full bg-purple-500 border border-black"></div>
                <div className="h-6 w-6 rounded-full bg-yellow-500 border border-black"></div>
                <div className="h-6 w-6 rounded-full bg-pink-500 border border-black"></div>
              </div>
              <span className="text-xs text-gray-400">5 membros</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />8 tarefas concluídas
              </span>
              <span className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-yellow-500" />6 pendentes
              </span>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Progresso: 40%</span>
              <span>40/100</span>
            </div>
            <div className="mt-1 h-1.5 w-full rounded-full bg-white/10">
              <div className="h-full w-[40%] rounded-full bg-gradient-to-r from-red-500 to-orange-500"></div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href="/projetos/2">Ver Detalhes</Link>
            </Button>
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href="/projetos/2/tarefas">Tarefas</Link>
            </Button>
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href="/projetos/2/kanban">Kanban</Link>
            </Button>
          </div>
        </div>

        {/* Project Card */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold">Portal Acadêmico</h2>
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Início: 05/01/2023
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Finalizado: 10/04/2023
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium">Concluído</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">Next.js</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">PostgreSQL</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">Tailwind</span>
          </div>

          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="h-6 w-6 rounded-full bg-red-500 border border-black"></div>
                <div className="h-6 w-6 rounded-full bg-blue-500 border border-black"></div>
                <div className="h-6 w-6 rounded-full bg-green-500 border border-black"></div>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 border border-black text-xs">
                  +2
                </div>
              </div>
              <span className="text-xs text-gray-400">6 membros</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                20 tarefas concluídas
              </span>
              <span className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-green-500" />0 pendentes
              </span>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Progresso: 100%</span>
              <span>100/100</span>
            </div>
            <div className="mt-1 h-1.5 w-full rounded-full bg-white/10">
              <div className="h-full w-full rounded-full bg-green-500"></div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href="/projetos/3">Ver Detalhes</Link>
            </Button>
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href="/projetos/3/tarefas">Tarefas</Link>
            </Button>
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href="/projetos/3/kanban">Kanban</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
