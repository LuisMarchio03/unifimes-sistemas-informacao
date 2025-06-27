"use client"

import { TrendingUp, Users, Clock, Target } from "lucide-react"

interface Template {
  id: string
  name: string
  category: string
  isActive: boolean
  usageCount: number
  estimatedHours: number
}

interface TemplateStatsProps {
  templates: Template[]
}

export function TemplateStats({ templates }: TemplateStatsProps) {
  const totalTemplates = templates.length
  const activeTemplates = templates.filter((t) => t.isActive).length
  const totalUsage = templates.reduce((sum, t) => sum + t.usageCount, 0)
  const avgHours = Math.round(templates.reduce((sum, t) => sum + t.estimatedHours, 0) / templates.length)

  const stats = [
    {
      label: "Total de Templates",
      value: totalTemplates,
      icon: Target,
      color: "text-blue-400",
    },
    {
      label: "Templates Ativos",
      value: activeTemplates,
      icon: TrendingUp,
      color: "text-success",
    },
    {
      label: "Uso Total",
      value: totalUsage,
      icon: Users,
      color: "text-purple-400",
    },
    {
      label: "Média de Horas",
      value: `${avgHours}h`,
      icon: Clock,
      color: "text-orange-400",
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="rounded-lg bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <div className={`rounded-lg bg-white/10 p-2 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
