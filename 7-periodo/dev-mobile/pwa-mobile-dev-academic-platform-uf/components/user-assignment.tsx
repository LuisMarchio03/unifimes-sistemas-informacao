"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X, Check, UserPlus, Plus } from "lucide-react"

// Mock user data
export const mockUsers = [
  {
    id: "user1",
    name: "Luís Gabriel",
    email: "luis.gabriel@email.com",
    avatar: "LG",
    role: "Desenvolvedor Frontend",
    color: "bg-red-500",
  },
  {
    id: "user2",
    name: "Ana Carolina",
    email: "ana.carolina@email.com",
    avatar: "AC",
    role: "Orientadora",
    color: "bg-green-500",
  },
  {
    id: "user3",
    name: "Vitor Joáz",
    email: "vitor.joaz@email.com",
    avatar: "VJ",
    role: "Desenvolvedor Backend",
    color: "bg-blue-500",
  },
  {
    id: "user4",
    name: "Marcos Oliveira",
    email: "marcos.oliveira@email.com",
    avatar: "MO",
    role: "UX/UI Designer",
    color: "bg-yellow-500",
  },
  {
    id: "user5",
    name: "Juliana Santos",
    email: "juliana.santos@email.com",
    avatar: "JS",
    role: "QA Tester",
    color: "bg-purple-500",
  },
  {
    id: "user6",
    name: "Pedro Henrique",
    email: "pedro.henrique@email.com",
    avatar: "PH",
    role: "DevOps Engineer",
    color: "bg-indigo-500",
  },
  {
    id: "user7",
    name: "Carla Mendes",
    email: "carla.mendes@email.com",
    avatar: "CM",
    role: "Product Manager",
    color: "bg-pink-500",
  },
]

interface UserAssignmentProps {
  assignedUsers: string[]
  onAssign: (userId: string) => void
  onUnassign: (userId: string) => void
  maxDisplayed?: number
  size?: "sm" | "md" | "lg"
  showAddButton?: boolean
}

export function UserAssignment({
  assignedUsers,
  onAssign,
  onUnassign,
  maxDisplayed = 3,
  size = "md",
  showAddButton = true,
}: UserAssignmentProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter users based on search query
  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Get assigned user objects
  const assignedUserObjects = mockUsers.filter((user) => assignedUsers.includes(user.id))

  // Size classes
  const avatarSizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-1">
        {/* Display assigned users */}
        <div className="flex -space-x-2">
          {assignedUserObjects.slice(0, maxDisplayed).map((user) => (
            <div
              key={user.id}
              className={`${avatarSizeClasses[size]} ${user.color} flex items-center justify-center rounded-full border border-black font-medium text-white`}
              title={`${user.name} (${user.role})`}
            >
              {user.avatar}
            </div>
          ))}
          {assignedUserObjects.length > maxDisplayed && (
            <div
              className={`${avatarSizeClasses[size]} flex items-center justify-center rounded-full bg-white/20 border border-black text-xs`}
            >
              +{assignedUserObjects.length - maxDisplayed}
            </div>
          )}
        </div>

        {/* Add user button */}
        {showAddButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="ml-1 h-8 w-8 rounded-full p-0"
          >
            <UserPlus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* User selection dropdown */}
      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-64 rounded-lg border border-white/10 bg-black/95 p-3 shadow-lg">
          <div className="mb-3">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium">Atribuir Usuários</h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsOpen(false)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar usuários..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-white/10 pl-8"
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const isAssigned = assignedUsers.includes(user.id)
                return (
                  <div
                    key={user.id}
                    className={`mb-2 flex items-center justify-between rounded-lg p-2 transition-colors ${
                      isAssigned ? "bg-primary/10" : "hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-8 w-8 ${user.color} flex items-center justify-center rounded-full text-sm font-medium text-white`}
                      >
                        {user.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.role}</p>
                      </div>
                    </div>
                    <Button
                      variant={isAssigned ? "default" : "outline"}
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => (isAssigned ? onUnassign(user.id) : onAssign(user.id))}
                    >
                      {isAssigned ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                    </Button>
                  </div>
                )
              })
            ) : (
              <div className="py-3 text-center text-sm text-gray-400">Nenhum usuário encontrado</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

interface UserAvatarProps {
  userId: string
  size?: "sm" | "md" | "lg"
  showName?: boolean
}

export function UserAvatar({ userId, size = "md", showName = false }: UserAvatarProps) {
  const user = mockUsers.find((u) => u.id === userId)

  if (!user) return null

  const avatarSizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${avatarSizeClasses[size]} ${user.color} flex items-center justify-center rounded-full font-medium text-white`}
        title={`${user.name} (${user.role})`}
      >
        {user.avatar}
      </div>
      {showName && (
        <div>
          <p className="text-sm font-medium">{user.name}</p>
          {size === "lg" && <p className="text-xs text-gray-400">{user.role}</p>}
        </div>
      )}
    </div>
  )
}

interface UserSelectorProps {
  selectedUsers: string[]
  onChange: (selectedUsers: string[]) => void
  label?: string
  placeholder?: string
}

export function UserSelector({
  selectedUsers,
  onChange,
  label = "Atribuir a",
  placeholder = "Selecionar usuários",
}: UserSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter users based on search query
  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      onChange(selectedUsers.filter((id) => id !== userId))
    } else {
      onChange([...selectedUsers, userId])
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {label && <label className="mb-1 block text-sm text-gray-400">{label}</label>}

      <div
        className="flex min-h-[38px] w-full cursor-pointer items-center rounded-lg border border-white/10 bg-black/80 px-3 py-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedUsers.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {selectedUsers.map((userId) => {
              const user = mockUsers.find((u) => u.id === userId)
              if (!user) return null
              return (
                <div
                  key={userId}
                  className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleUser(userId)
                  }}
                >
                  <div
                    className={`h-4 w-4 ${user.color} flex items-center justify-center rounded-full text-[10px] font-medium text-white`}
                  >
                    {user.avatar}
                  </div>
                  <span className="text-xs">{user.name}</span>
                  <X className="h-3 w-3 cursor-pointer text-gray-400 hover:text-white" />
                </div>
              )
            })}
          </div>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-white/10 bg-black/95 p-3 shadow-lg">
          <div className="mb-2 relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar usuários..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-white/10 pl-8"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const isSelected = selectedUsers.includes(user.id)
                return (
                  <div
                    key={user.id}
                    className={`mb-2 flex items-center justify-between rounded-lg p-2 transition-colors ${
                      isSelected ? "bg-primary/10" : "hover:bg-white/5"
                    }`}
                    onClick={() => toggleUser(user.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-8 w-8 ${user.color} flex items-center justify-center rounded-full text-sm font-medium text-white`}
                      >
                        {user.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.role}</p>
                      </div>
                    </div>
                    <div
                      className={`h-5 w-5 rounded ${isSelected ? "bg-primary" : "border border-white/20"} flex items-center justify-center`}
                    >
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="py-3 text-center text-sm text-gray-400">Nenhum usuário encontrado</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
