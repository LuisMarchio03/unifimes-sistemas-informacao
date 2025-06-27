"use client"

import { toast } from "sonner"

export interface UserProfile {
  id: string
  name: string
  role: string
  organization: string
  title: string
  email: string
  phone: string
  location: string
  bio: string
  avatar?: string
  skills: string[]
  socialLinks: {
    github?: string
    linkedin?: string
    website?: string
  }
  education: {
    institution: string
    course: string
    startYear: number
    endYear?: number
  }[]
  certificates: {
    id: string
    name: string
    issuer: string
    date: string
    url?: string
  }[]
}

class ProfileService {
  private static instance: ProfileService;

  private constructor() {}

  static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const storedProfile = localStorage.getItem(`profile_${userId}`);
      if (!storedProfile) {
        // Retornar perfil inicial se não existir
        const initialProfile: UserProfile = {
          id: userId,
          name: "Luís Gabriel Marchió Batista",
          role: "Estudante",
          organization: "UNIFIMES",
          title: "Desenvolvedor Frontend",
          email: "luis.gabriel@email.com",
          phone: "(64) 99999-9999",
          location: "Mineiros, GO",
          bio: "Desenvolvedor Frontend apaixonado por criar interfaces intuitivas e responsivas.",
          skills: ["React", "TypeScript", "Next.js", "TailwindCSS"],
          socialLinks: {
            github: "https://github.com/username",
            linkedin: "https://linkedin.com/in/username"
          },
          education: [
            {
              institution: "UNIFIMES",
              course: "Sistemas de Informação",
              startYear: 2021,
              endYear: 2025
            }
          ],
          certificates: []
        };
        await this.saveProfile(userId, initialProfile);
        return initialProfile;
      }

      return JSON.parse(storedProfile);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      return null;
    }
  }

  async saveProfile(userId: string, profile: UserProfile): Promise<void> {
    try {
      localStorage.setItem(`profile_${userId}`, JSON.stringify(profile));
      toast.success('Perfil salvo com sucesso');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast.error('Erro ao salvar perfil');
      throw error;
    }
  }

  async updateAvatar(userId: string, file: File): Promise<string> {
    try {
      // Converter arquivo para Base64
      const base64 = await this.fileToBase64(file);
      
      // Atualizar perfil com nova foto
      const profile = await this.getProfile(userId);
      if (profile) {
        profile.avatar = base64;
        await this.saveProfile(userId, profile);
      }
      
      return base64;
    } catch (error) {
      console.error('Erro ao atualizar avatar:', error);
      toast.error('Erro ao atualizar foto');
      throw error;
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}

export const profileService = ProfileService.getInstance();
