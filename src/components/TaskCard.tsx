'use client';

import { Task } from '@/types/task';
import { useState } from 'react';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onDragStart?: (e: React.DragEvent, task: Task) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, targetTask: Task) => void;
  isDragging?: boolean;
}

export default function TaskCard({
  task,
  onToggleComplete,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging = false,
}: TaskCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(task.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all duration-200 hover:shadow-md ${
        isDragging ? 'opacity-50 transform rotate-2' : ''
      } ${task.completed ? 'opacity-75' : ''} ${!task.completed ? 'touch-none' : ''}`}
      draggable={!task.completed}
      onDragStart={onDragStart ? (e) => onDragStart(e, task) : undefined}
      onDragOver={onDragOver}
      onDrop={onDrop ? (e) => onDrop(e, task) : undefined}
      style={{
        userSelect: task.completed ? 'auto' : 'none',
        WebkitUserSelect: task.completed ? 'auto' : 'none',
        touchAction: task.completed ? 'auto' : 'none',
      }}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            task.completed
              ? 'bg-purple-500 border-purple-500 text-white'
              : 'border-gray-300 hover:border-purple-400'
          }`}
        >
          {task.completed && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3
            className={`font-medium text-gray-900 mb-1 ${
              task.completed ? 'line-through text-gray-500' : ''
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p
              className={`text-sm text-gray-600 mb-2 break-words ${
                task.completed ? 'line-through' : ''
              }`}
            >
              {task.description}
            </p>
          )}
          <div className="flex flex-col gap-1 text-xs text-gray-400">
            <span>Создано: {formatDate(task.createdAt)}</span>
            {task.completed && task.completedAt && (
              <span>Завершено: {formatDate(task.completedAt)}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {!task.completed && (
            <div className="flex items-center text-xs text-gray-400">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
              Перетащите
            </div>
          )}
          <button
            onClick={handleDelete}
            className={`p-1 rounded transition-colors ${
              showDeleteConfirm
                ? 'text-red-600 bg-red-50'
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
            }`}
            title={showDeleteConfirm ? 'Нажмите еще раз для удаления' : 'Удалить задачу'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
