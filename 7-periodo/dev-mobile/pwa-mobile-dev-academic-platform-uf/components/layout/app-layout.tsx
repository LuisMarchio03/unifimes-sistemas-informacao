"use client"

import { ReactNode } from "react"
import { Header } from "./header"
import { MobileNavbar } from "./mobile-navbar"

type LayoutProps = {
  children: ReactNode
  title: string
  showSearch?: boolean
  onSearchChange?: (term: string) => void
  searchValue?: string
}

export function AppLayout({ 
  children, 
  title, 
  showSearch = false,
  onSearchChange,
  searchValue = ""
}: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header 
        title={title} 
        showSearch={showSearch} 
        onSearchChange={onSearchChange}
        searchValue={searchValue}
      />
      
      <main className="flex-1 px-4 py-6 mb-16">
        {children}
      </main>
      
      <MobileNavbar />
    </div>
  )
}
