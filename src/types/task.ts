export interface Task {
  id: string;
  title: string;
  description: string;
  priority: number;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface TaskFormData {
  title: string;
  description: string;
}

