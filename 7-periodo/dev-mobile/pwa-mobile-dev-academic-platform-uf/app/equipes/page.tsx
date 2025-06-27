"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Filter, UserPlus, ChevronRight, Plus } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"

export default function EquipesPage() {
  return (
    <AppLayout title="Equipes" showSearch={false}>
      <main className="flex-1">
        <div className="mb-6 space-y-6">
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filtrar
              </Button>
              <Button variant="outline" size="sm">
                Minhas Equipes
              </Button>
            </div>
            <Link href="/equipes/nova">
              <Button variant="default" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Nova Equipe
              </Button>
            </Link>
          </div>

          {/* My Teams */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Minhas Equipes</h2>

            <div className="space-y-4">
              <Link href="/equipes/1">
                <div className="rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                      <span className="text-lg font-bold">DW</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">Dev Web</h3>
                      <p className="text-sm text-gray-400">8 membros • 3 projetos</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium">Ativo</span>
                      <span className="mt-1 text-xs text-gray-400">Criado em 15/03/2023</span>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/equipes/2">
                <div className="rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <span className="text-lg font-bold">IA</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">Inteligência Artificial</h3>
                      <p className="text-sm text-gray-400">5 membros • 2 projetos</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-medium">Em formação</span>
                      <span className="mt-1 text-xs text-gray-400">Criado em 10/05/2023</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Team Invitations */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Convites Pendentes</h2>

            <div className="space-y-4">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                    <span className="text-lg font-bold">MD</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">Mobile Developers</h3>
                    <p className="text-sm text-gray-400">12 membros • 4 projetos</p>
                    <p className="mt-1 text-xs text-gray-300">
                      <span className="text-orange-400">Ana Silva</span> convidou você para participar desta equipe
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button variant="default" size="sm" className="flex-1">
                    Aceitar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Recusar
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Suggested Teams */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Equipes Sugeridas</h2>
              <Button variant="ghost" size="sm">
                Ver todas
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                    <span className="text-lg font-bold">DS</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">Data Science</h3>
                    <p className="text-sm text-gray-400">15 membros • 6 projetos</p>
                    <div className="mt-2 flex -space-x-2">
                      <div className="h-6 w-6 rounded-full bg-red-500 border border-black"></div>
                      <div className="h-6 w-6 rounded-full bg-blue-500 border border-black"></div>
                      <div className="h-6 w-6 rounded-full bg-green-500 border border-black"></div>
                      <div className="h-6 w-6 rounded-full bg-yellow-500 border border-black"></div>
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 border border-black text-xs">
                        +11
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Entrar
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-lg font-bold">UX</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">UX/UI Design</h3>
                    <p className="text-sm text-gray-400">9 membros • 5 projetos</p>
                    <div className="mt-2 flex -space-x-2">
                      <div className="h-6 w-6 rounded-full bg-orange-500 border border-black"></div>
                      <div className="h-6 w-6 rounded-full bg-purple-500 border border-black"></div>
                      <div className="h-6 w-6 rounded-full bg-pink-500 border border-black"></div>
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 border border-black text-xs">
                        +6
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Entrar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  )
}
