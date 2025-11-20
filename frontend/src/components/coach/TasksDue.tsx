'use client';

import React from 'react';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  description: string;
  completed: boolean;
  urgent?: boolean;
  dueDate?: Date;
}

interface TasksDueProps {
  tasks: Task[];
  onToggleTask?: (taskId: string) => void;
}

export default function TasksDue({ tasks, onToggleTask }: TasksDueProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-400" />
        <p>All tasks completed!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div 
          key={task.id}
          className={`flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group ${
            task.completed ? 'opacity-60' : ''
          }`}
          onClick={() => onToggleTask?.(task.id)}
        >
          <button className="mt-0.5 flex-shrink-0">
            {task.completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <p className={`text-sm ${
              task.completed 
                ? 'text-gray-500 line-through' 
                : 'text-gray-900'
            }`}>
              {task.description}
            </p>
            {task.dueDate && !task.completed && mounted && (
              <p className="text-xs text-gray-500 mt-1">
                Due {task.dueDate.toLocaleDateString()}
              </p>
            )}
          </div>

          {task.urgent && !task.completed && (
            <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
          )}
        </div>
      ))}
    </div>
  );
}
