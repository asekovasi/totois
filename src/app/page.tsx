'use client';

import { useState, useEffect } from 'react';
import { Task, TaskFormData } from '@/types/task';
import { saveTasks, loadTasks } from '@/utils/cookies';
import TaskModal from '@/components/TaskModal';
import TaskList from '@/components/TaskList';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadedTasks = loadTasks();
    setTasks(loadedTasks);
  }, []);

  useEffect(() => {
    if (mounted) {
      saveTasks(tasks);
    }
  }, [tasks, mounted]);

  const addTask = (taskData: TaskFormData) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description,
      priority: tasks.filter(t => !t.completed).length,
      completed: false,
      createdAt: new Date(),
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date() : undefined,
            }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const reorderTasks = (reorderedTasks: Task[]) => {
    setTasks(reorderedTasks);
  };

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Список задач
          </h1>
          <p className="text-gray-600">
            Организуйте свои дела эффективно
          </p>
        </div>

        {/* Add Task Button */}
        <div className="mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto mx-auto block px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Добавить задачу
            </span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-purple-600">{activeTasks.length}</div>
            <div className="text-sm text-gray-600">Активных задач</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
            <div className="text-sm text-gray-600">Завершенных задач</div>
          </div>
        </div>

        {/* Tab Navigation - Desktop */}
        <div className="hidden md:flex mb-6 bg-white rounded-xl p-1 shadow-sm border border-gray-100">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-3 px-4 rounded-lg transition-all font-medium ${
              activeTab === 'active'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            Активные ({activeTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-3 px-4 rounded-lg transition-all font-medium ${
              activeTab === 'completed'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            Завершенные ({completedTasks.length})
          </button>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <TaskList
            tasks={tasks}
            onToggleComplete={toggleTaskComplete}
            onDelete={deleteTask}
            onReorder={reorderTasks}
            showCompleted={activeTab === 'completed'}
          />
        </div>
        
        {/* Tab Navigation - Mobile (at the bottom) */}
        <div className="md:hidden mt-6 bg-white rounded-xl p-1 shadow-sm border border-gray-100 fixed bottom-4 left-4 right-4 z-10">
          <div className="flex w-full">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-3 px-4 rounded-lg transition-all font-medium ${
                activeTab === 'active'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Активные ({activeTasks.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-3 px-4 rounded-lg transition-all font-medium ${
                activeTab === 'completed'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Завершенные ({completedTasks.length})
            </button>
          </div>
        </div>

        {/* Task Modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={addTask}
        />
      </div>
    </div>
  );
}