"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, Star } from "lucide-react"
import { ProjectOpportunity } from "@/lib/types/project"

interface ProjectOpportunitiesProps {
  opportunities: ProjectOpportunity[]
  isLoading: boolean
  onApply: (projectId: string) => void
  limit?: number
}

export function ProjectOpportunities({ opportunities, isLoading, onApply, limit = 2 }: ProjectOpportunitiesProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Novas Oportunidades</h2>
        <Button variant="ghost" size="sm">
          <Link href="/projetos">
            Ver todas
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center">
            <p className="text-gray-400 text-sm">Carregando oportunidades...</p>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center">
            <p className="text-gray-400 text-sm">Não há oportunidades disponíveis no momento.</p>
          </div>
        ) : (
          opportunities.slice(0, limit).map((opportunity, index) => (
            <div key={opportunity.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-sm">{opportunity.title}</h3>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-yellow-400">Recomendado</span>
                </div>
              </div>
              <p className="text-xs text-gray-300 mb-2">{opportunity.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                <span>{opportunity.duration}</span>
                <span>
                  {opportunity.technologies.slice(0, 2).join(", ")}
                  {opportunity.technologies.length > 2 ? " e mais" : ""}
                </span>
              </div>
              
              {opportunity.userRelation === 'candidato' ? (
                <Button variant="ghost" size="sm" className="w-full" disabled>
                  Candidatura enviada
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full" 
                  onClick={() => onApply(opportunity.id)}
                >
                  Candidatar-se
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
