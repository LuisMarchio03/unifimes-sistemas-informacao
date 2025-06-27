"use client"

import { toast } from "sonner"
import { Project, ProjectOpportunity, ProjectStatus, ProjectSummary, UserProjectRelation } from "@/lib/types/project"
import { Task, User } from "@/lib/types/index"
import { generateId } from "@/lib/utils"

class ProjectService {
  private static instance: ProjectService;
  private constructor() {}

  static getInstance(): ProjectService {
    if (!ProjectService.instance) {
      ProjectService.instance = new ProjectService();
    }
    return ProjectService.instance;
  }

  // Métodos para gerenciamento de projetos
  async getAllProjects(): Promise<Project[]> {
    try {
      const storedData = localStorage.getItem('projects');
      if (!storedData) return [];

      const projects: Project[] = JSON.parse(storedData);
      return projects;
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      // Se houver erro ao parsear, limpa o storage
      localStorage.removeItem('projects');
      return [];
    }
  }

  async saveAllProjects(projects: Project[]): Promise<void> {
    try {
      localStorage.setItem('projects', JSON.stringify(projects));
    } catch (error) {
      console.error('Erro ao salvar projetos:', error);
      throw error;
    }
  }

  async getProjectById(id: string): Promise<Project | null> {
    try {
      const projects = await this.getAllProjects();
      const project = projects.find(p => p.id === id);
      if (!project) return null;
      
      return project;
    } catch (error) {
      console.error('Erro ao buscar projeto:', error);
      return null;
    }
  }

  async createProject(projectData: Omit<Project, 'id'>, userId: string, userName: string): Promise<Project> {
    try {
      const newProject: Project = {
        id: generateId(),
        ...projectData,
        status: 'aberto',
        progress: 0,
        participants: [{
          id: userId,
          name: userName,
          role: 'coordenador',
          relation: 'coordenador'
        }]
      };

      const projects = await this.getAllProjects();
      projects.push(newProject);
      await this.saveAllProjects(projects);
      
      toast.success('Projeto criado com sucesso');
      return newProject;
    } catch (error) {
      toast.error('Erro ao criar projeto');
      throw error;
    }
  }

  async getUserProjects(userId: string): Promise<Project[]> {
    try {
      const allProjects = await this.getAllProjects();
      return allProjects.filter(project => 
        project.participants.some(participant => participant.id === userId)
      );
    } catch (error) {
      console.error('Erro ao buscar projetos do usuário:', error);
      return [];
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      const projects = await this.getAllProjects();
      const projectIndex = projects.findIndex(p => p.id === id);
      
      if (projectIndex === -1) {
        throw new Error('Projeto não encontrado');
      }

      projects.splice(projectIndex, 1);
      await this.saveAllProjects(projects);
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      throw error;
    }
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    try {
      const projects = await this.getAllProjects();
      const projectIndex = projects.findIndex(p => p.id === id);
      
      if (projectIndex === -1) {
        throw new Error('Projeto não encontrado');
      }

      const updatedProject = {
        ...projects[projectIndex],
        ...updates,
        // Garante que campos obrigatórios não sejam removidos
        id: projects[projectIndex].id,
        status: updates.status || projects[projectIndex].status,
        participants: updates.participants || projects[projectIndex].participants
      };

      projects[projectIndex] = updatedProject;
      await this.saveAllProjects(projects);

      return updatedProject;
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      throw error;
    }
  }

  async getProjectSummary(id: string): Promise<ProjectSummary | null> {
    try {
      const project = await this.getProjectById(id);
      if (!project) return null;

      return {
        id: project.id,
        title: project.title,
        description: project.description,
        status: project.status,
        deadline: project.deadline,
        participantsCount: project.participants.length,
        progress: project.progress,
        technologies: project.technologies,
        difficulty: project.difficulty,
        userRelation: project.userRelation || 'nao_associado'
      };
    } catch (error) {
      console.error('Erro ao obter resumo do projeto:', error);
      return null;
    }
  }

  async addParticipant(projectId: string, userId: string, name: string, role: string): Promise<void> {
    try {
      const project = await this.getProjectById(projectId);
      if (!project) throw new Error('Projeto não encontrado');

      const userAlreadyParticipant = project.participants.some(p => p.id === userId);
      if (userAlreadyParticipant) throw new Error('Usuário já é participante do projeto');

      const updatedProject = {
        ...project,
        participants: [
          ...project.participants,
          {
            id: userId,
            name,
            role,
            relation: 'membro' as UserProjectRelation
          }
        ]
      };

      await this.updateProject(projectId, updatedProject);
      toast.success('Participante adicionado com sucesso');
    } catch (error) {
      console.error('Erro ao adicionar participante:', error);
      throw error;
    }
  }

  async removeParticipant(projectId: string, userId: string): Promise<void> {
    try {
      const project = await this.getProjectById(projectId);
      if (!project) throw new Error('Projeto não encontrado');

      const updatedProject = {
        ...project,
        participants: project.participants.filter(p => p.id !== userId)
      };

      await this.updateProject(projectId, updatedProject);
      toast.success('Participante removido com sucesso');
    } catch (error) {
      console.error('Erro ao remover participante:', error);
      throw error;
    }
  }

  async initializeProjectData(userId: string, userName: string): Promise<void> {
    try {
      const projects = await this.getAllProjects();
      if (projects.length === 0) {
        // Criar alguns projetos de exemplo apenas se não houver nenhum
        const exampleProjects: Omit<Project, 'id'>[] = [
          {
            title: "Projeto Exemplo 1",
            description: "Um projeto de exemplo para demonstração",
            type: "academic",
            category: "Desenvolvimento",
            status: "aberto",
            progress: 0,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            participants: [{
              id: userId,
              name: userName,
              role: "coordenador",
              relation: "coordenador"
            }],
            maxParticipants: 5,
            workload: 40,
            leader: {
              id: userId,
              name: userName,
              email: "exemplo@email.com"
            },
            objectives: ["Objetivo 1", "Objetivo 2"],
            tasks: [],
            technologies: ["React", "TypeScript"],
            difficulty: "Intermediário",
            location: "Remoto"
          }
        ];

        for (const projectData of exampleProjects) {
          await this.createProject(projectData, userId, userName);
        }
      }
    } catch (error) {
      console.error('Erro ao inicializar dados:', error);
      toast.error('Erro ao inicializar dados do projeto');
    }
  }
  async getProjectOpportunities(userId: string): Promise<ProjectOpportunity[]> {
    try {
      const allProjects = await this.getAllProjects();
      // Retornar projetos que estão abertos e que o usuário ainda não participa
      const opportunities = allProjects.filter(project => 
        project.status === 'aberto' && 
        !project.participants.some(p => p.id === userId) &&
        project.participants.length < project.maxParticipants
      );

      return opportunities.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        duration: project.deadline || "",
        technologies: project.technologies,
        difficulty: project.difficulty,
        location: project.location,
        status: project.status,
        participants: project.participants.length,
        maxParticipants: project.maxParticipants,
        userRelation: 'nao_associado'
      }));
    } catch (error) {
      console.error('Erro ao buscar oportunidades:', error);
      return [];
    }
  }

  async applyToProject(projectId: string, userId: string, userName: string): Promise<boolean> {
    try {
      const project = await this.getProjectById(projectId);
      if (!project) throw new Error('Projeto não encontrado');

      if (project.participants.some(p => p.id === userId)) {
        throw new Error('Você já é participante deste projeto');
      }

      const updatedProject = {
        ...project,
        participants: [
          ...project.participants,
          {
            id: userId,
            name: userName,
            role: 'candidato',
            relation: 'candidato' as UserProjectRelation
          }
        ]
      };

      await this.updateProject(projectId, updatedProject);
      toast.success('Candidatura enviada com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao candidatar-se ao projeto:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao candidatar-se ao projeto');
      return false;
    }
  }
}

// Exportar instância única do serviço
export const projectService = ProjectService.getInstance();
