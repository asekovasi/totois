'use client';

import { useState } from 'react';
import { Task } from '@/types/task';
import TaskCard from './TaskCard';
import TouchDragHandler from './TouchDragHandler';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (reorderedTasks: Task[]) => void;
  showCompleted: boolean;
}

export default function TaskList({
  tasks,
  onToggleComplete,
  onDelete,
  onReorder,
  showCompleted,
}: TaskListProps) {
  const [draggingTask, setDraggingTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter(task => task.completed === showCompleted);
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (showCompleted) {
      // Sort completed tasks by completion date (newest first)
      const dateA = a.completedAt || new Date(0);
      const dateB = b.completedAt || new Date(0);
      return dateB.getTime() - dateA.getTime();
    } else {
      // Sort active tasks by priority
      return a.priority - b.priority;
    }
  });

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    if (showCompleted) return; // No dragging for completed tasks
    setDraggingTask(task);
    e.dataTransfer.setData('text/plain', task.id);
    
    // For better drag preview in some browsers
    if (e.dataTransfer.setDragImage) {
      const dragEl = document.getElementById(`task-${task.id}`);
      if (dragEl) {
        e.dataTransfer.setDragImage(dragEl, 20, 20);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetTask: Task) => {
    e.preventDefault();
    if (showCompleted || !draggingTask) return;

    const draggedTaskId = e.dataTransfer.getData('text/plain');
    if (draggedTaskId === targetTask.id) return;

    const activeTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    const fromIndex = activeTasks.findIndex(task => task.id === draggedTaskId);
    const toIndex = activeTasks.findIndex(task => task.id === targetTask.id);

    if (fromIndex !== -1 && toIndex !== -1) {
      // Reorder the array
      const reorderedActiveTasks = [...activeTasks];
      const [movedTask] = reorderedActiveTasks.splice(fromIndex, 1);
      reorderedActiveTasks.splice(toIndex, 0, movedTask);

      // Update priorities
      const updatedActiveTasks = reorderedActiveTasks.map((task, index) => ({
        ...task,
        priority: index,
      }));

      // Combine with completed tasks and update
      onReorder([...updatedActiveTasks, ...completedTasks]);
    }

    setDraggingTask(null);
  };

  const handleTouchReorder = (fromIndex: number, toIndex: number) => {
    if (showCompleted) return;

    const activeTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    if (fromIndex >= 0 && fromIndex < activeTasks.length && 
        toIndex >= 0 && toIndex < activeTasks.length) {
      
      const reorderedActiveTasks = [...activeTasks];
      const [movedTask] = reorderedActiveTasks.splice(fromIndex, 1);
      reorderedActiveTasks.splice(toIndex, 0, movedTask);

      // Update priorities
      const updatedActiveTasks = reorderedActiveTasks.map((task, index) => ({
        ...task,
        priority: index,
      }));

      // Combine with completed tasks and update
      onReorder([...updatedActiveTasks, ...completedTasks]);
    }
  };

  if (sortedTasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {showCompleted ? 'Нет завершенных задач' : 'Нет активных задач'}
      </div>
    );
  }

  return showCompleted ? (
    // Completed tasks - no drag and drop
    <div className="space-y-3">
      {sortedTasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
        />
      ))}
    </div>
  ) : (
    // Active tasks with drag and drop
    <TouchDragHandler
      onReorder={handleTouchReorder}
    >
      <div className="space-y-3">
        {sortedTasks.map((task, index) => (
          <div 
            key={task.id}
            id={`task-${task.id}`}
            data-task-index={index}
          >
            <TaskCard
              task={task}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              isDragging={draggingTask?.id === task.id}
            />
          </div>
        ))}
      </div>
    </TouchDragHandler>
  );
}
