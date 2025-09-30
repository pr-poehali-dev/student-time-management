export interface Task {
  id: number;
  title: string;
  description: string;
  deadline: Date;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: string;
  timeSpent?: number;
  estimatedTime?: number;
}

export interface PresetTask {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface ScheduleItem {
  id: number;
  time: string;
  event: string;
  type: 'lecture' | 'seminar' | 'lab' | 'meeting' | 'break' | 'other';
}

export interface ImportantDate {
  id: number;
  date: Date;
  title: string;
  description: string;
}

export interface Theme {
  id: string;
  name: string;
  price: number;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface Rank {
  title: string;
  tasks: number;
  icon: string;
  color: string;
}

export interface Avatar {
  id: string;
  name: string;
  emoji: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
