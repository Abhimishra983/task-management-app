import { Task } from '@/types/task';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface TaskSummaryProps {
  tasks: Task[];
}

export default function TaskSummary({ tasks }: TaskSummaryProps) {
  const total = tasks.length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const completed = tasks.filter(t => t.status === 'completed').length;

  const stats = [
    {
      label: 'Total Tasks',
      value: total,
      icon: AlertCircle,
      color: 'bg-blue-500',
    },
    {
      label: 'Pending',
      value: pending,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      label: 'In Progress',
      value: inProgress,
      icon: AlertCircle,
      color: 'bg-purple-500',
    },
    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}