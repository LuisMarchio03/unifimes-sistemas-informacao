"use client"

import { useState, useEffect } from "react"
import { useAuthStore } from "../stores/auth-store"
import type { AuthStore } from "../types/auth-store"
import { profileService, UserProfile } from "@/lib/services/profile-service"

export function useProfile() {
  const { user } = useAuthStore() as AuthStore
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [user?.id])

  const loadProfile = async () => {
    if (!user?.id) return
    
    try {
      setIsLoading(true)
      const userProfile = await profileService.getProfile(user.id)
      setProfile(userProfile)
    } catch (error) {
      console.error("Erro ao carregar perfil:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (updatedProfile: UserProfile) => {
    if (!user?.id || !profile) return
    
    try {
      await profileService.saveProfile(user.id, updatedProfile)
      setProfile(updatedProfile)
      setIsEditing(false)
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
    }
  }

  const updateAvatar = async (file: File) => {
    if (!user?.id || !profile) return
    
    try {
      const avatarUrl = await profileService.updateAvatar(user.id, file)
      setProfile({ ...profile, avatar: avatarUrl })
    } catch (error) {
      console.error("Erro ao atualizar avatar:", error)
    }
  }

  return {
    profile,
    isLoading,
    isEditing,
    setIsEditing,
    updateProfile,
    updateAvatar
  }
}
