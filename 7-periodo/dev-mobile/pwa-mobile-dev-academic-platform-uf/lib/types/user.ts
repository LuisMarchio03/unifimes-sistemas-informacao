export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "student" | "professor"
  avatar?: string
  institution?: string
  registration?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}
