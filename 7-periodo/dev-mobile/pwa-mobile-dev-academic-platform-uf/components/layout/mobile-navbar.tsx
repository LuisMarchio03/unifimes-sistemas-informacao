"use client"

import { Home, Briefcase, Users, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function MobileNavbar() {
  const pathname = usePathname()
  
  // Verifica qual página está ativa
  const isActive = (path: string) => {
    return pathname === path ? "text-primary" : "text-gray-400"
  }
  
  return (
    <footer className="border-t border-white/10 bg-black px-2 py-2 fixed bottom-0 left-0 right-0">
      <div className="flex items-center justify-around">
        <Link href="/home" className={`flex flex-col items-center p-2 ${isActive("/home")} hover:text-white`}>
          <Home className="h-6 w-6" />
          <span className="mt-1 text-xs">Início</span>
        </Link>
        <Link href="/projetos" className={`flex flex-col items-center p-2 ${isActive("/projetos")} hover:text-white`}>
          <Briefcase className="h-6 w-6" />
          <span className="mt-1 text-xs">Projetos</span>
        </Link>
        {/* <Link href="/equipes" className={`flex flex-col items-center p-2 ${isActive("/equipes")} hover:text-white`}>
          <Users className="h-6 w-6" />
          <span className="mt-1 text-xs">Equipes</span>
        </Link> */}
        <Link href="/perfil" className={`flex flex-col items-center p-2 ${isActive("/perfil")} hover:text-white`}>
          <User className="h-6 w-6" />
          <span className="mt-1 text-xs">Perfil</span>
        </Link>
      </div>
    </footer>
  )
}
