export interface Project {
  id: string
  title: string
  description: string
  status: "Em andamento" | "Aberto" | "Concluído" | "Pausado"
  startDate: string
  endDate: string
  leader: {
    id: string
    name: string
    email: string
    role: string
    color: string
    avatar: string
  }
  members: Array<{
    id: string
    name: string
    email: string
    role: string
    color: string
    avatar: string
  }>
  progress: number
  category: string
  skills: string[]
  workload: number
  priority: "high" | "medium" | "low"
  tasks: Array<{
    id: string
    title: string
    description: string
    status: "Em progresso" | "Pendente" | "Concluído"
    assignedTo: string[]
    startDate: string
    endDate: string
    priority: "high" | "medium" | "low"
  }>
}

export const mockProjects: Record<string, Project> = {
  "1": {
    id: "1",
    title: "Sistema de Gestão Integrada",
    description:
      "Desenvolver e implementar um sistema integrado de gestão empresarial que otimize os processos de vendas, estoque, financeiro e recursos humanos, aumentando a eficiência operacional e reduzindo custos.",
    status: "Em andamento",
    startDate: "15/03/2023",
    endDate: "30/11/2023",
    progress: 75,
    category: "Desenvolvimento",
    skills: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    workload: 40,
    priority: "high",
    leader: {
      id: "1",
      name: "Ana Carolina",
      email: "ana@unifimes.edu.br",
      role: "Coordenadora",
      color: "bg-blue-500",
      avatar: "AC",
    },
    members: [
      {
        id: "1",
        name: "Ana Carolina",
        email: "ana@unifimes.edu.br",
        role: "Coordenadora",
        color: "bg-blue-500",
        avatar: "AC",
      },
      {
        id: "2",
        name: "Luís Gabriel",
        email: "luis@mail.com",
        role: "Desenvolvedor",
        color: "bg-green-500",
        avatar: "LG",
      },
      {
        id: "3",
        name: "Maria Silva",
        email: "maria@unifimes.edu.br",
        role: "Designer",
        color: "bg-purple-500",
        avatar: "MS",
      },
      {
        id: "4",
        name: "João Santos",
        email: "joao@unifimes.edu.br",
        role: "Analista",
        color: "bg-orange-500",
        avatar: "JS",
      },
      {
        id: "5",
        name: "Carla Oliveira",
        email: "carla@unifimes.edu.br",
        role: "Testadora",
        color: "bg-pink-500",
        avatar: "CO",
      },
    ],
    tasks: [
      {
        id: "1",
        title: "Desenvolvimento Módulo Vendas",
        description: "Implementar funcionalidades de vendas com carrinho, checkout e pagamento",
        status: "Em progresso",
        assignedTo: ["2", "3"],
        startDate: "16/04/2023",
        endDate: "30/06/2023",
        priority: "high",
      },
      {
        id: "2",
        title: "Desenvolvimento Módulo Estoque",
        description: "Sistema de controle de estoque com alertas automáticos",
        status: "Pendente",
        assignedTo: ["5"],
        startDate: "01/07/2023",
        endDate: "15/08/2023",
        priority: "medium",
      },
      {
        id: "3",
        title: "Integração e Testes",
        description: "Testes de integração entre módulos e correção de bugs",
        status: "Concluído",
        assignedTo: ["4", "5"],
        startDate: "01/09/2023",
        endDate: "15/10/2023",
        priority: "high",
      },
    ],
  },
  "2": {
    id: "2",
    title: "Aplicativo Educacional",
    description:
      "Desenvolvimento de aplicativo mobile para auxiliar estudantes no aprendizado de matemática com gamificação e exercícios interativos.",
    status: "Aberto",
    startDate: "01/09/2023",
    endDate: "31/12/2023",
    progress: 30,
    category: "Mobile",
    skills: ["React Native", "Firebase", "JavaScript"],
    workload: 30,
    priority: "medium",
    leader: {
      id: "3",
      name: "Prof. Luís",
      email: "luisprof@mail.com",
      role: "Professor Orientador",
      color: "bg-indigo-500",
      avatar: "PL",
    },
    members: [
      {
        id: "3",
        name: "Prof. Luís",
        email: "luisprof@mail.com",
        role: "Professor Orientador",
        color: "bg-indigo-500",
        avatar: "PL",
      },
      {
        id: "6",
        name: "Pedro Costa",
        email: "pedro@unifimes.edu.br",
        role: "Desenvolvedor Mobile",
        color: "bg-cyan-500",
        avatar: "PC",
      },
      {
        id: "7",
        name: "Julia Ferreira",
        email: "julia@unifimes.edu.br",
        role: "UX Designer",
        color: "bg-rose-500",
        avatar: "JF",
      },
    ],
    tasks: [
      {
        id: "4",
        title: "Prototipagem da Interface",
        description: "Criar protótipos das telas principais do aplicativo",
        status: "Concluído",
        assignedTo: ["7"],
        startDate: "01/09/2023",
        endDate: "15/09/2023",
        priority: "high",
      },
      {
        id: "5",
        title: "Desenvolvimento Base",
        description: "Estrutura básica do app e navegação",
        status: "Em progresso",
        assignedTo: ["6"],
        startDate: "16/09/2023",
        endDate: "30/10/2023",
        priority: "high",
      },
      {
        id: "6",
        title: "Sistema de Gamificação",
        description: "Implementar pontuação, badges e ranking",
        status: "Pendente",
        assignedTo: ["6"],
        startDate: "01/11/2023",
        endDate: "30/11/2023",
        priority: "medium",
      },
    ],
  },
  "3": {
    id: "3",
    title: "Sistema de Biblioteca Digital",
    description:
      "Plataforma web para gerenciamento de acervo digital da biblioteca universitária com sistema de empréstimos e reservas online.",
    status: "Aberto",
    startDate: "15/10/2023",
    endDate: "30/03/2024",
    progress: 10,
    category: "Web",
    skills: ["Vue.js", "Laravel", "MySQL"],
    workload: 35,
    priority: "medium",
    leader: {
      id: "8",
      name: "Dr. Roberto Lima",
      email: "roberto@unifimes.edu.br",
      role: "Professor Coordenador",
      color: "bg-emerald-500",
      avatar: "RL",
    },
    members: [
      {
        id: "8",
        name: "Dr. Roberto Lima",
        email: "roberto@unifimes.edu.br",
        role: "Professor Coordenador",
        color: "bg-emerald-500",
        avatar: "RL",
      },
    ],
    tasks: [
      {
        id: "7",
        title: "Análise de Requisitos",
        description: "Levantamento de requisitos com bibliotecários",
        status: "Em progresso",
        assignedTo: ["8"],
        startDate: "15/10/2023",
        endDate: "30/10/2023",
        priority: "high",
      },
    ],
  },
}

export const getProjectById = (id: string): Project | null => {
  return mockProjects[id] || null
}

export const getAllProjects = (): Project[] => {
  return Object.values(mockProjects)
}
