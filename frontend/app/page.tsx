'use client';

import { useState, useEffect } from 'react';
import { Task, TaskFormData } from '@/types/task'; 
import TaskTable from '@/components/TaskTable'; 
import TaskForm from '@/components/TaskForm'; 
import TaskSummary from '@/components/TaskSummary'; 
import AuthForm from '@/components/AuthForm'; 
import { api } from '@/lib/api'; 
import toast from 'react-hot-toast';
import { LogOut } from 'lucide-react';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token });
      fetchTasks();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await api.getTasks(filterStatus);
      setTasks(data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: TaskFormData) => {
    try {
      const newTask = await api.createTask(taskData);
      setTasks([newTask, ...tasks]);
      toast.success('Task created successfully');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateStatus = async (
  taskId: number,
  status: "pending" | "in_progress" | "completed"
)=> {
    try {
      const updatedTask = await api.updateTask(taskId, { status });
      setTasks(tasks.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      toast.success('Task updated');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await api.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setShowAuth(true);
    toast.success('Logged out successfully');
  };

  const handleAuthSuccess = (token: string) => {
    localStorage.setItem('token', token);
    setUser({ token });
    setShowAuth(false);
    fetchTasks();
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Task Manager</h1>
          <AuthForm onSuccess={handleAuthSuccess} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Task Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <TaskSummary tasks={tasks} />
            <div className="mt-6">
              <TaskForm onSubmit={handleCreateTask} />
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Tasks</h2>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  fetchTasks();
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <TaskTable
                tasks={tasks}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDeleteTask}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}