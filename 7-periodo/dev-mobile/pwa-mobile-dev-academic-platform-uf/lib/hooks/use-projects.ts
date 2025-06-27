"use client";

import { useState, useEffect, useCallback } from 'react';
import { Project, projects as mockProjects } from '@/lib/data/mock-data';
import { useAuth } from './use-auth';
import { toast } from 'sonner';

interface UseProjectsReturn {
  projects: Project[];
  userProjects: Project[];
  filteredProjects: Project[];
  isLoading: boolean;
  error: Error | null;
  searchProjects: (query: string) => void;
  filterProjects: (filters: ProjectFilters) => void;
  createProject: (project: Omit<Project, 'id'>) => Promise<Project>;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
}

interface ProjectFilters {
  category?: string;
  status?: Project['status'];
  priority?: Project['priority'];
  skill?: string;
}

export function useProjects(): UseProjectsReturn {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { state: authState } = useAuth();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Em uma aplicação real, isso seria uma chamada à API
        setAllProjects(mockProjects);
        setFilteredProjects(mockProjects);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar projetos';
        setError(new Error(errorMessage));
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Filtrar projetos do usuário atual
  const userProjects = allProjects.filter(project => 
    project.members.some(member => member.id === authState.user?.id) ||
    project.leader.id === authState.user?.id
  );

  const searchProjects = useCallback((query: string) => {
    if (!query.trim()) {
      setFilteredProjects(allProjects);
      return;
    }

    const searchTerm = query.toLowerCase();
    const results = allProjects.filter(project => 
      project.title.toLowerCase().includes(searchTerm) ||
      project.description.toLowerCase().includes(searchTerm) ||
      project.category.toLowerCase().includes(searchTerm) ||
      project.skills.some(skill => skill.toLowerCase().includes(searchTerm))
    );

    setFilteredProjects(results);
  }, [allProjects]);

  const filterProjects = useCallback((filters: ProjectFilters) => {
    let results = [...allProjects];

    if (filters.category) {
      results = results.filter(project => project.category === filters.category);
    }

    if (filters.status) {
      results = results.filter(project => project.status === filters.status);
    }

    if (filters.priority) {
      results = results.filter(project => project.priority === filters.priority);
    }

    if (filters.skill) {
      results = results.filter(project => 
        project.skills.includes(filters.skill!)
      );
    }

    setFilteredProjects(results);
  }, [allProjects]);

  const createProject = async (projectData: Omit<Project, 'id'>): Promise<Project> => {
    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newProject: Project = {
        id: `proj-${Date.now()}`,
        ...projectData
      };

      setAllProjects(current => [...current, newProject]);
      setFilteredProjects(current => [...current, newProject]);
      
      toast.success('Projeto criado com sucesso');
      return newProject;
      
    } catch (err) {
      const errorMessage = 'Erro ao criar projeto';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    try {
      const updatedProjects = allProjects.map(project =>
        project.id === projectId ? { ...project, ...updates } : project
      );

      setAllProjects(updatedProjects);
      setFilteredProjects(updatedProjects);
      
      toast.success('Projeto atualizado com sucesso');
      
    } catch (err) {
      const errorMessage = 'Erro ao atualizar projeto';
      setError(new Error(errorMessage));
      toast.error(errorMessage);
    }
  };

  const deleteProject = (projectId: string) => {
    try {
      setAllProjects(current => current.filter(p => p.id !== projectId));
      setFilteredProjects(current => current.filter(p => p.id !== projectId));
      
      toast.success('Projeto removido com sucesso');
      
    } catch (err) {
      const errorMessage = 'Erro ao remover projeto';
      setError(new Error(errorMessage));
      toast.error(errorMessage);
    }
  };

  return {
    projects: allProjects,
    userProjects,
    filteredProjects,
    isLoading,
    error,
    searchProjects,
    filterProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
