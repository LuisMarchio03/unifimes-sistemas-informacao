// Serviço para carregar dados da página inicial
import { Project, ProjectSummary } from "../types/project";

/**
 * Carrega projetos ativos para o dashboard
 */
export const loadDashboardData = (userId: string) => {
  const { getUserProjects } = require("./project-service");
  
  // Obter projetos do usuário
  const userProjects = getUserProjects(userId);
  
  // Calcular estatísticas
  const totalProjects = userProjects.length;
  interface HoursByDifficulty {
    [key: string]: number;
  }

  const estimatedHours: number = userProjects.reduce((total: number, project: ProjectSummary) => {
    // Estimativa de horas baseada em dificuldade
    const hoursByDifficulty: HoursByDifficulty = {
      'Iniciante': 20,
      'Intermediário': 40,
      'Avançado': 60
    };
    return total + (hoursByDifficulty[project.difficulty] || 30);
  }, 0);
  
  // Gerar tarefas fictícias para fins de demonstração
  const tasks = generateSampleTasks(userProjects);
  
  // Gerar atividades recentes
  const recentActivity = generateSampleActivity(userProjects, userId);
  
  return {
    userProjects,
    totalProjects,
    totalHours: estimatedHours,
    tasksDueToday: tasks.filter(task => isToday(task.endDate)),
    upcomingDeadlines: tasks
      .filter(task => isFuture(task.endDate))
      .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
      .slice(0, 3),
    recentActivity
  };
};

// Funções auxiliares
const isToday = (dateStr: string) => {
  const today = new Date();
  const date = new Date(dateStr);
  return date.getDate() === today.getDate() && 
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

const isFuture = (dateStr: string) => {
  const today = new Date();
  const date = new Date(dateStr);
  return date >= today;
};

// Gerar tarefas de amostra
const generateSampleTasks = (projects: ProjectSummary[]) => {
  const tasks = [];
  
  // Data atual
  const today = new Date();
  
  // Criar algumas tarefas para cada projeto
  for (const project of projects) {
    // Tarefas para hoje
    tasks.push({
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: `Revisão de código: ${project.title.split(' ')[0]}`,
      projectId: project.id,
      projectTitle: project.title,
      endDate: today.toISOString(),
      priority: "high"
    });
    
    // Tarefas para próximos dias
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tasks.push({
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: `Implementar funcionalidade para ${project.title}`,
      projectId: project.id,
      projectTitle: project.title,
      endDate: tomorrow.toISOString(),
      priority: "medium"
    });
    
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    tasks.push({
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: `Documentar API de ${project.title}`,
      projectId: project.id,
      projectTitle: project.title,
      endDate: nextWeek.toISOString(),
      priority: "low"
    });
  }
  
  return tasks;
};

// Gerar atividades recentes de amostra
const generateSampleActivity = (projects: ProjectSummary[], userId: string) => {
  interface Activity {
    type: 'comment' | 'task' | 'project';
    projectId: string;
    projectTitle: string;
    user: string;
    content: string;
    timestamp: string;
  }

  const activities: Activity[] = [];
  
  if (projects.length === 0) return activities;
  
  // Data atual
  const now = Date.now();
  
  // Tipos de atividades
  const activityTypes: Array<'comment' | 'task' | 'project'> = ['comment', 'task', 'project'];
  
  // Gerar 3-5 atividades
  const numActivities = Math.min(projects.length * 2, 5);
  
  for (let i = 0; i < numActivities; i++) {
    const project = projects[Math.floor(Math.random() * projects.length)];
    const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    
    let content = '';
    switch (type) {
      case 'comment':
        content = 'Adicionou um comentário ao documento de requisitos';
        break;
      case 'task':
        content = 'Concluiu a tarefa "Implementar autenticação"';
        break;
      case 'project':
        content = 'Atualizou o status do projeto';
        break;
    }
    
    activities.push({
      type,
      projectId: project.id,
      projectTitle: project.title,
      user: type === 'project' ? 'Prof. Silva' : 'Você',
      content,
      timestamp: new Date(now - (i + 1) * 1000 * 60 * 60).toISOString() // Cada atividade é uma hora mais antiga
    });
  }
  
  return activities;
};
