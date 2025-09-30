import { PresetTask, Theme, Rank, Avatar, Category } from '@/types';

export const presetTasks: PresetTask[] = [
  { id: 'hw_math', title: 'Домашнее задание по математике', description: 'Решить задачи из учебника', category: 'Учеба' },
  { id: 'hw_physics', title: 'Домашнее задание по физике', description: 'Выполнить лабораторную работу', category: 'Учеба' },
  { id: 'hw_programming', title: 'Программирование - практика', description: 'Написать код по заданию', category: 'Учеба' },
  { id: 'essay', title: 'Написать эссе', description: 'Подготовить текст для сдачи', category: 'Учеба' },
  { id: 'presentation', title: 'Подготовить презентацию', description: 'Создать слайды для защиты', category: 'Проект' },
  { id: 'exam_prep', title: 'Подготовка к экзамену', description: 'Повторить материал по предмету', category: 'Учеба' },
  { id: 'reading', title: 'Прочитать литературу', description: 'Изучить учебные материалы', category: 'Учеба' },
  { id: 'group_work', title: 'Групповой проект', description: 'Встретиться с командой и поработать', category: 'Проект' },
  { id: 'consultation', title: 'Консультация с преподавателем', description: 'Обсудить вопросы по курсу', category: 'Встречи' },
  { id: 'library', title: 'Посетить библиотеку', description: 'Взять необходимые книги', category: 'Другое' },
];

export const avatars: Avatar[] = [
  { id: 'Cat', name: 'Котенок', emoji: '🐱' },
  { id: 'Squirrel', name: 'Обезьяна', emoji: '🐵' },
  { id: 'Dog', name: 'Собачка', emoji: '🐶' },
  { id: 'Bird', name: 'Попугай', emoji: '🦜' },
];

export const categories: Category[] = [
  { id: 'all', name: 'Все', icon: 'ListTodo' },
  { id: 'Учеба', name: 'Учеба', icon: 'BookOpen' },
  { id: 'Проект', name: 'Проекты', icon: 'Briefcase' },
  { id: 'Встречи', name: 'Встречи', icon: 'Users' },
  { id: 'Другое', name: 'Личное', icon: 'Heart' },
];

export const themes: Theme[] = [
  { id: 'default', name: 'Красно-жёлтая', price: 0, colors: { primary: '0 85% 70%', secondary: '48 100% 71%', accent: '48 100% 71%' } },
  { id: 'ocean', name: 'Океан', price: 10000, colors: { primary: '199 89% 48%', secondary: '204 94% 94%', accent: '212 100% 48%' } },
  { id: 'forest', name: 'Лес', price: 10000, colors: { primary: '142 71% 45%', secondary: '84 100% 90%', accent: '120 60% 50%' } },
  { id: 'sunset', name: 'Закат', price: 10000, colors: { primary: '14 100% 57%', secondary: '340 82% 52%', accent: '45 100% 51%' } },
  { id: 'purple', name: 'Фиолетовая мечта', price: 10000, colors: { primary: '271 91% 65%', secondary: '291 64% 42%', accent: '280 100% 70%' } },
  { id: 'dark', name: 'Тёмная материя', price: 10000, colors: { primary: '215 28% 17%', secondary: '217 33% 17%', accent: '262 83% 58%' } },
];

export const ranks: Rank[] = [
  { title: 'Новичок', tasks: 10, icon: 'Sparkles', color: 'text-gray-500' },
  { title: 'Ученик планировщик', tasks: 50, icon: 'BookOpen', color: 'text-blue-500' },
  { title: 'Начинающий организатор', tasks: 100, icon: 'Target', color: 'text-green-500' },
  { title: 'Мастер напоминаний', tasks: 500, icon: 'Award', color: 'text-purple-500' },
  { title: 'Исследователь продуктивности', tasks: 1000, icon: 'Trophy', color: 'text-yellow-500' },
];