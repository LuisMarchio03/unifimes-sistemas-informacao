import { User } from "./user";

export interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

declare module "../stores/auth-store" {
  export const useAuthStore: () => AuthStore;
}
