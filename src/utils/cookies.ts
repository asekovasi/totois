import { Task } from '@/types/task';

export const TASKS_COOKIE_KEY = 'tasks';

export const saveTasks = (tasks: Task[]): void => {
  try {
    const tasksJson = JSON.stringify(tasks);
    document.cookie = `${TASKS_COOKIE_KEY}=${encodeURIComponent(tasksJson)}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  } catch (error) {
    console.error('Error saving tasks to cookies:', error);
  }
};

export const loadTasks = (): Task[] => {
  try {
    if (typeof document === 'undefined') return [];
    
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${TASKS_COOKIE_KEY}=`))
      ?.split('=')[1];

    if (!cookieValue) return [];

    const tasksJson = decodeURIComponent(cookieValue);
    const tasks = JSON.parse(tasksJson);
    
    // Convert date strings back to Date objects
    return tasks.map((task: Task) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
    }));
  } catch (error) {
    console.error('Error loading tasks from cookies:', error);
    return [];
  }
};

