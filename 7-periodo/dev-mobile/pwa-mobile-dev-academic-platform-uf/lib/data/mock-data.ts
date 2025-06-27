import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  color: string;
  joinDate: string;
  department: string;
  projects: string[];
  skills: string[];
  workload: {
    allocated: number;
    capacity: number;
  };
  stats: {
    completedTasks: number;
    ongoingTasks: number;
    totalHours: number;
  };
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  startDate: string;
  endDate: string;
  progress: number;
  category: string;
  skills: string[];
  workload: number;
  priority: 'low' | 'medium' | 'high';
  leader: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
  };
  members: User[];
  tasks: Task[];
  objectives: string[];
  resources: string[];
  budget: number;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignees: string[];
  startDate: string;
  dueDate: string;
  completedDate?: string;
  effort: number;
  progress: number;
  tags: string[];
  subtasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  comments: {
    id: string;
    userId: string;
    content: string;
    createdAt: string;
  }[];
}

// Generate mock users
export const users: User[] = [
  {
    id: "user1",
    name: "Luís Gabriel",
    email: "luis.gabriel@unifimes.edu.br",
    avatar: "LG",
    role: "Desenvolvedor Frontend",
    color: "bg-red-500",
    joinDate: "2023-01-15",
    department: "Tecnologia",
    projects: ["proj-1", "proj-2"],
    skills: ["React", "TypeScript", "UI/UX", "Next.js"],
    workload: {
      allocated: 32,
      capacity: 40
    },
    stats: {
      completedTasks: 24,
      ongoingTasks: 3,
      totalHours: 420
    }
  },
  {
    id: "user2",
    name: "Ana Carolina",
    email: "ana.carolina@unifimes.edu.br",
    avatar: "AC",
    role: "Orientadora",
    color: "bg-green-500",
    joinDate: "2022-08-01",
    department: "Pesquisa",
    projects: ["proj-1", "proj-3"],
    skills: ["Metodologia", "Gestão", "Pesquisa", "Análise de Dados"],
    workload: {
      allocated: 36,
      capacity: 40
    },
    stats: {
      completedTasks: 45,
      ongoingTasks: 5,
      totalHours: 780
    }
  },
  // Add more users as needed
];

// Generate mock projects
export const projects: Project[] = [
  {
    id: "proj-1",
    title: "Sistema de Gestão Acadêmica",
    description: "Desenvolvimento de uma plataforma integrada para gestão de projetos acadêmicos e pesquisa.",
    status: "active",
    startDate: "2024-02-01",
    endDate: "2024-12-15",
    progress: 35,
    category: "Desenvolvimento",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    workload: 1200,
    priority: "high",
    leader: {
      id: "user2",
      name: "Ana Carolina",
      email: "ana.carolina@unifimes.edu.br",
      role: "Orientadora",
      avatar: "AC"
    },
    members: users.filter(u => ["user1", "user2"].includes(u.id)),
    tasks: [],
    objectives: [
      "Desenvolver interface moderna e responsiva",
      "Implementar sistema de autenticação seguro",
      "Criar módulo de gestão de projetos",
      "Integrar com sistemas existentes"
    ],
    resources: [
      "Servidor dedicado",
      "Licenças de software",
      "Equipe de desenvolvimento",
      "Ambiente de testes"
    ],
    budget: 50000
  },
  // Add more projects as needed
];

// Generate mock tasks
export const tasks: Task[] = [
  {
    id: uuidv4(),
    projectId: "proj-1",
    title: "Configuração do Ambiente de Desenvolvimento",
    description: "Preparar ambiente com Node.js, React e ferramentas necessárias",
    status: "completed",
    priority: "high",
    assignees: ["user1"],
    startDate: "2024-02-01",
    dueDate: "2024-02-07",
    completedDate: "2024-02-06",
    effort: 16,
    progress: 100,
    tags: ["setup", "infraestrutura"],
    subtasks: [
      {
        id: uuidv4(),
        title: "Instalar Node.js e npm",
        completed: true
      },
      {
        id: uuidv4(),
        title: "Configurar ESLint e Prettier",
        completed: true
      }
    ],
    comments: [
      {
        id: uuidv4(),
        userId: "user1",
        content: "Ambiente configurado e testado com sucesso",
        createdAt: "2024-02-06T14:30:00Z"
      }
    ]
  },
  // Add more tasks as needed
];

// Update projects with tasks
projects.forEach(project => {
  project.tasks = tasks.filter(task => task.projectId === project.id);
});

// Helper functions for data manipulation
export const addTask = (task: Omit<Task, 'id'>) => {
  const newTask = { ...task, id: uuidv4() };
  tasks.push(newTask);
  return newTask;
};

export const updateTask = (taskId: string, updates: Partial<Task>) => {
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
    return tasks[taskIndex];
  }
  return null;
};

export const deleteTask = (taskId: string) => {
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    return true;
  }
  return false;
};

export const getProjectTasks = (projectId: string) => {
  return tasks.filter(task => task.projectId === projectId);
};

export const getUserTasks = (userId: string) => {
  return tasks.filter(task => task.assignees.includes(userId));
};

export const getProjectMembers = (projectId: string) => {
  const project = projects.find(p => p.id === projectId);
  return project ? project.members : [];
};

export const getUserProjects = (userId: string) => {
  return projects.filter(project => 
    project.members.some(member => member.id === userId)
  );
};
