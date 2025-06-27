// Tipos de projetos e status da plataforma

/**
 * Status possíveis para um projeto
 */
export type ProjectStatus = 
  | 'aberto'       // Aberto para inscrições
  | 'em_andamento' // Projeto iniciado e em desenvolvimento
  | 'concluido'    // Projeto finalizado
  | 'cancelado';   // Projeto cancelado

/**
 * Nível de dificuldade do projeto
 */
export type ProjectDifficulty = 'Iniciante' | 'Intermediário' | 'Avançado';

/**
 * Localização do projeto
 */
export type ProjectLocation = 'Remoto' | 'Presencial' | 'Híbrido';

/**
 * Tipo do projeto
 */
export type ProjectType = 'academic' | 'professional' | 'personal' | 'social';

/**
 * Prioridade de tarefas e objetivos
 */
export type ProjectPriority = 'low' | 'medium' | 'high';

/**
 * Relação do usuário com um projeto
 */
export type UserProjectRelation =
  | 'coordenador'   // Criador ou coordenador do projeto
  | 'membro'        // Participante ativo no projeto
  | 'candidato'     // Usuário se candidatou e aguarda aprovação
  | 'convidado'     // Usuário foi convidado mas ainda não aceitou
  | 'nao_associado'; // Usuário não tem relação com este projeto

/**
 * Interface para usuário
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  color?: string;
  avatar?: string;
}

/**
 * Interface para tarefa
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Pendente' | 'Em andamento' | 'Em revisão' | 'Concluído';
  assignedTo: string[];
  startDate: string;
  endDate: string;
  priority: ProjectPriority;
}

/**
 * Interface para projeto completo
 */
export interface Project {
  id: string;
  title: string;
  description: string;
  type: ProjectType;
  category: string;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  endDate: string;
  deadline?: string;
  participants: {
    id: string;
    name: string;
    role: string;
    relation: UserProjectRelation;
  }[];
  maxParticipants: number;
  workload: number;
  budget?: number;
  leader: User;
  objectives: string[];
  tasks: Task[];
  technologies: string[];
  difficulty: ProjectDifficulty;
  location: ProjectLocation;
  requirements?: string;
  userRelation?: UserProjectRelation;
}

/**
 * Interface para projeto simplificado (usado em listagens)
 */
export interface ProjectSummary {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  deadline?: string;
  participantsCount: number;
  progress: number;
  technologies: string[];
  difficulty: ProjectDifficulty;
  userRelation?: UserProjectRelation;
}

/**
 * Interface para uma oportunidade (projeto disponível para candidatura)
 */
export interface ProjectOpportunity {
  id: string;
  title: string;
  description: string;
  duration: string;
  technologies: string[];
  difficulty: ProjectDifficulty;
  location: ProjectLocation;
  status: ProjectStatus;
  participants: number;
  maxParticipants: number;
  userRelation?: UserProjectRelation; // Relação do usuário atual com a oportunidade
}
