"use client"

import { Bell, Search } from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/lib/stores/auth-store"

type HeaderProps = {
  title: string
  showSearch?: boolean
  onSearchChange?: (term: string) => void
  searchValue?: string
}

export function Header({ 
  title, 
  showSearch = false,
  onSearchChange,
  searchValue = ""
}: HeaderProps) {
  const { user } = useAuthStore()
  
  return (
    <header className="border-b border-white/10 px-4 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{title}</h1>
        <div className="flex items-center space-x-4">
          {showSearch && (
            <button>
              <Search className="h-6 w-6" />
            </button>
          )}
          <Link href="/notificacoes">
            <Bell className="h-6 w-6" />
          </Link>
          <Link href="/perfil">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
              <span className="text-sm font-bold">{user?.avatar || user?.name?.charAt(0) || "U"}</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}
