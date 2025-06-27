import { ProjectSummary, ProjectOpportunity, ProjectStatus, Project, UserProjectRelation } from "./project";

interface ProjectApplication {
  projectId: string;
  userId: string;
  role: string;
  message?: string;
}

export interface ProjectsHookReturn {
  userProjects: ProjectSummary[];
  opportunities: ProjectOpportunity[];
  isLoading: boolean;
  error: Error | null;
  selectedProjectId: string | null;
  showApplicationModal: boolean;
  showNewProjectModal: boolean;
  showApprovalModal: boolean;
  pendingCandidates: {id: string, name: string, role?: string}[];
  selectedProject: Project | null;
  statusFilter: ProjectStatus | 'todos';
  relationFilter: UserProjectRelation | 'todos';
  setStatusFilter: (filter: ProjectStatus | 'todos') => void;
  setRelationFilter: (filter: UserProjectRelation | 'todos') => void;
  getFilteredProjects: (status?: ProjectStatus | 'todos', relation?: UserProjectRelation | 'todos') => ProjectSummary[];
  setShowApplicationModal: (show: boolean) => void;
  setShowNewProjectModal: (show: boolean) => void;
  setShowApprovalModal: (show: boolean) => void;
  handleApplyToProject: (projectId: string) => void;
  handleApplicationSubmit: (applicationData: ProjectApplication) => Promise<void>;
  handleCreateProject: (projectData: Partial<Project>) => Promise<void>;
  handleDeleteProject: (projectId: string) => Promise<void>;
  handleViewProject: (projectId: string) => void;
  handleShowApprovals: (projectId: string) => Promise<void>;
  handleApproveCandidate: (candidateId: string) => Promise<void>;
  loadProjects: () => Promise<void>;
}

declare module "../hooks/use-projects" {
  export function useProjects(): ProjectsHookReturn;
  export type { ProjectsHookReturn, ProjectApplication };
}
