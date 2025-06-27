import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, AuthState } from "@/lib/types/user"

// Fixed users for the system
const FIXED_USERS: Record<string, User> = {
  "admin@mail.com": {
    id: "1",
    email: "admin@mail.com",
    name: "Administrador",
    role: "admin",
    avatar: "AD",
    institution: "UNIFIMES",
  },
  "luis@mail.com": {
    id: "2",
    email: "luis@mail.com",
    name: "Luís Gabriel",
    role: "student",
    avatar: "LG",
    institution: "UNIFIMES",
    registration: "2023001",
  },
  "luisprof@mail.com": {
    id: "3",
    email: "luisprof@mail.com",
    name: "Prof. Luís",
    role: "professor",
    avatar: "PL",
    institution: "UNIFIMES",
    registration: "PROF001",
  },
}

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (permission: string) => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        const user = FIXED_USERS[email.toLowerCase()]

        if (user && password) {
          // Any password works for demo
          set({ user, isAuthenticated: true })
          return true
        }

        return false
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      hasPermission: (permission: string) => {
        const { user } = get()
        if (!user) return false

        const permissions: Record<string, string[]> = {
          admin: ["create_project", "manage_users", "view_all", "delete_project"],
          professor: ["create_project", "manage_students", "view_projects"],
          student: ["view_projects", "apply_projects", "join_teams"],
        }

        return permissions[user.role]?.includes(permission) || false
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
