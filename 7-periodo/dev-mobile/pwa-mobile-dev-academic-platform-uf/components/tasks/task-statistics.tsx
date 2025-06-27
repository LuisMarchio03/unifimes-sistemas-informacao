import React from 'react';
import { Task } from '@/lib/types/task';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface TaskStatsProps {
  tasks: Task[];
  className?: string;
}

export function TaskStatistics({ tasks, className }: TaskStatsProps) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const review = tasks.filter(t => t.status === 'review').length;
  const todo = tasks.filter(t => t.status === 'todo').length;

  const completion = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-5 ${className}`}>
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="text-sm text-gray-400">Total de Tarefas</div>
        <div className="text-2xl font-bold">{total}</div>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="text-sm text-gray-400">Concluídas</div>
        <div className="text-2xl font-bold text-green-500">{completed}</div>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="text-sm text-gray-400">Em Progresso</div>
        <div className="text-2xl font-bold text-yellow-500">{inProgress}</div>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="text-sm text-gray-400">Em Revisão</div>
        <div className="text-2xl font-bold text-blue-500">{review}</div>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="mb-2 text-sm text-gray-400">Conclusão</div>
        <div className="flex items-center gap-4">
          <div className="h-12 w-12">
            <CircularProgressbar
              value={completion}
              text={`${completion}%`}
              styles={{
                path: {
                  stroke: `rgb(34, 197, 94)`,
                },
                trail: {
                  stroke: 'rgba(255, 255, 255, 0.1)',
                },
                text: {
                  fill: '#fff',
                  fontSize: '24px',
                },
              }}
            />
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-400">{todo} tarefas pendentes</div>
          </div>
        </div>
      </div>
    </div>
  );
}
