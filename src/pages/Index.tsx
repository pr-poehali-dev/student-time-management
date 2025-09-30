import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Task {
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

interface PresetTask {
  id: string;
  title: string;
  description: string;
  category: string;
}

interface ScheduleItem {
  id: number;
  time: string;
  event: string;
  type: 'lecture' | 'seminar' | 'lab' | 'meeting' | 'break' | 'other';
}

interface ImportantDate {
  id: number;
  date: Date;
  title: string;
  description: string;
}

interface Theme {
  id: string;
  name: string;
  price: number;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const Index = () => {
  const presetTasks: PresetTask[] = [
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

  const [tasks, setTasks] = useState<Task[]>([]);
  const [studentCourse, setStudentCourse] = useState<string>('');
  const [showCourseDialog, setShowCourseDialog] = useState<boolean>(true);
  const [points, setPoints] = useState<number>(0);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [importantDates, setImportantDates] = useState<ImportantDate[]>([]);
  const [currentTheme, setCurrentTheme] = useState<string>('default');
  const [showShopDialog, setShowShopDialog] = useState<boolean>(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState<boolean>(false);
  const [showDateDialog, setShowDateDialog] = useState<boolean>(false);
  const [showTipsDialog, setShowTipsDialog] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = [
    { id: 'all', name: 'Все', icon: 'ListTodo' },
    { id: 'Учеба', name: 'Учеба', icon: 'BookOpen' },
    { id: 'Проект', name: 'Проекты', icon: 'Briefcase' },
    { id: 'Встречи', name: 'Встречи', icon: 'Users' },
    { id: 'Другое', name: 'Личное', icon: 'Heart' },
  ];
  
  const themes: Theme[] = [
    { id: 'default', name: 'Красно-жёлтая', price: 0, colors: { primary: '0 85% 70%', secondary: '48 100% 71%', accent: '48 100% 71%' } },
    { id: 'ocean', name: 'Океан', price: 10000, colors: { primary: '199 89% 48%', secondary: '204 94% 94%', accent: '212 100% 48%' } },
    { id: 'forest', name: 'Лес', price: 10000, colors: { primary: '142 71% 45%', secondary: '84 100% 90%', accent: '120 60% 50%' } },
    { id: 'sunset', name: 'Закат', price: 10000, colors: { primary: '14 100% 57%', secondary: '340 82% 52%', accent: '45 100% 51%' } },
    { id: 'purple', name: 'Фиолетовая мечта', price: 10000, colors: { primary: '271 91% 65%', secondary: '291 64% 42%', accent: '280 100% 70%' } },
    { id: 'dark', name: 'Тёмная материя', price: 10000, colors: { primary: '215 28% 17%', secondary: '217 33% 17%', accent: '262 83% 58%' } },
  ];

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'schedule' | 'calendar'>('dashboard');
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: new Date(),
    priority: 'medium' as 'high' | 'medium' | 'low',
    category: '',
  });

  const handleCourseSelect = (course: string) => {
    setStudentCourse(course);
    setShowCourseDialog(false);
  };

  const todayTasks = tasks.filter(
    (task) =>
      task.deadline.toDateString() === new Date().toDateString() && !task.completed
  );

  const upcomingTasks = tasks.filter(
    (task) =>
      task.deadline > new Date() &&
      task.deadline.toDateString() !== new Date().toDateString() &&
      !task.completed
  );

  const completedTasksCount = tasks.filter((task) => task.completed).length;
  const progressPercentage = (completedTasksCount / tasks.length) * 100;
  
  const filteredTasks = selectedCategory === 'all' 
    ? tasks 
    : tasks.filter(task => task.category === selectedCategory);
  
  const getCategoryStats = () => {
    const stats: { [key: string]: number } = {};
    tasks.forEach(task => {
      if (task.completed) {
        stats[task.category] = (stats[task.category] || 0) + 1;
      }
    });
    return stats;
  };
  
  const getTimeStats = () => {
    const totalTime = tasks.reduce((acc, task) => acc + (task.timeSpent || 0), 0);
    const categoryTime: { [key: string]: number } = {};
    tasks.forEach(task => {
      if (task.timeSpent) {
        categoryTime[task.category] = (categoryTime[task.category] || 0) + task.timeSpent;
      }
    });
    return { totalTime, categoryTime };
  };

  const toggleTask = (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      setPoints(prev => prev + 100);
    }
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-primary text-primary-foreground';
      case 'medium':
        return 'bg-secondary text-secondary-foreground';
      case 'low':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Высокий';
      case 'medium':
        return 'Средний';
      case 'low':
        return 'Низкий';
      default:
        return 'Средний';
    }
  };

  const getTimeUntilDeadline = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `через ${days} ${days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}`;
    } else if (hours > 0) {
      return `через ${hours} ${hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'}`;
    } else {
      return 'сегодня';
    }
  };

  const handlePresetSelect = (presetId: string) => {
    const preset = presetTasks.find(p => p.id === presetId);
    if (preset) {
      setNewTask({
        ...newTask,
        title: preset.title,
        description: preset.description,
        category: preset.category,
      });
      setSelectedPreset(presetId);
    }
  };

  const addTask = () => {
    if (newTask.title.trim()) {
      setTasks([
        ...tasks,
        {
          id: tasks.length + 1,
          ...newTask,
          completed: false,
        },
      ]);
      setNewTask({
        title: '',
        description: '',
        deadline: new Date(),
        priority: 'medium',
        category: '',
      });
      setSelectedPreset('');
    }
  };

  const addScheduleItem = (item: Omit<ScheduleItem, 'id'>) => {
    setSchedule([...schedule, { ...item, id: schedule.length + 1 }]);
  };

  const removeScheduleItem = (id: number) => {
    setSchedule(schedule.filter(item => item.id !== id));
  };

  const addImportantDate = (date: ImportantDate) => {
    setImportantDates([...importantDates, date]);
  };

  const buyTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme && points >= theme.price) {
      setPoints(prev => prev - theme.price);
      setCurrentTheme(themeId);
      applyTheme(theme);
      setShowShopDialog(false);
    }
  };

  const applyTheme = (theme: Theme) => {
    document.documentElement.style.setProperty('--primary', theme.colors.primary);
    document.documentElement.style.setProperty('--secondary', theme.colors.secondary);
    document.documentElement.style.setProperty('--accent', theme.colors.accent);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Student Time Manager
              </h1>
              {studentCourse && (
                <>
                  <Badge variant="outline" className="text-sm py-1 px-3">
                    {studentCourse} курс
                  </Badge>
                  <Button
                    variant="outline"
                    onClick={() => setShowShopDialog(true)}
                    className="gap-2"
                  >
                    <Icon name="Sparkles" size={18} className="text-accent" />
                    <span className="font-bold">{points}</span>
                  </Button>
                </>
              )}
            </div>
            <div className="flex gap-2">
              {studentCourse && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowShopDialog(true)}
                    className="gap-2"
                  >
                    <Icon name="ShoppingBag" size={18} />
                    <span className="hidden md:inline">Магазин</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCourseDialog(true)}
                    className="gap-2"
                  >
                    <Icon name="GraduationCap" size={18} />
                    <span className="hidden md:inline">Сменить курс</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowTipsDialog(true)}
                    className="gap-2"
                  >
                    <Icon name="HelpCircle" size={18} />
                    <span className="hidden md:inline">Помощь</span>
                  </Button>
                </>
              )}
              <Button
                variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('dashboard')}
                className="gap-2"
              >
                <Icon name="LayoutDashboard" size={18} />
                <span className="hidden md:inline">Главная</span>
              </Button>
              <Button
                variant={activeTab === 'schedule' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('schedule')}
                className="gap-2"
              >
                <Icon name="CalendarDays" size={18} />
                <span className="hidden md:inline">Расписание</span>
              </Button>
              <Button
                variant={activeTab === 'calendar' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('calendar')}
                className="gap-2"
              >
                <Icon name="Calendar" size={18} />
                <span className="hidden md:inline">Календарь</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-lg transition-all animate-scale-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Задачи на сегодня</h3>
                  <Icon name="CheckCircle2" size={24} className="text-primary" />
                </div>
                <p className="text-4xl font-bold text-primary">{todayTasks.length}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Требуют внимания
                </p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20 hover:shadow-lg transition-all animate-scale-in" style={{animationDelay: '0.1s'}}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Предстоящие</h3>
                  <Icon name="Clock" size={24} className="text-secondary-foreground" />
                </div>
                <p className="text-4xl font-bold text-secondary-foreground">
                  {upcomingTasks.length}
                </p>
                <p className="text-sm text-muted-foreground mt-2">На этой неделе</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:shadow-lg transition-all animate-scale-in" style={{animationDelay: '0.2s'}}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Прогресс</h3>
                  <Icon name="TrendingUp" size={24} className="text-accent-foreground" />
                </div>
                <p className="text-4xl font-bold text-accent-foreground">
                  {Math.round(progressPercentage)}%
                </p>
                <Progress value={progressPercentage} className="mt-4" />
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h2 className="text-2xl font-bold">Ближайшие дедлайны</h2>
                  <div className="flex gap-2 flex-wrap">
                    {categories.map(cat => (
                      <Button
                        key={cat.id}
                        variant={selectedCategory === cat.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(cat.id)}
                        className="gap-2"
                      >
                        <Icon name={cat.icon as any} size={16} />
                        <span className="hidden sm:inline">{cat.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {selectedCategory === 'all' ? 'Все задачи' : `Категория: ${categories.find(c => c.id === selectedCategory)?.name}`}
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="gap-2 shadow-lg hover:shadow-xl transition-shadow">
                        <Icon name="Plus" size={18} />
                        Добавить задачу
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Новая задача</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label htmlFor="preset">Выберите задачу из списка</Label>
                          <Select value={selectedPreset} onValueChange={handlePresetSelect}>
                            <SelectTrigger>
                              <SelectValue placeholder="Или выберите готовую задачу..." />
                            </SelectTrigger>
                            <SelectContent>
                              {presetTasks.map((preset) => (
                                <SelectItem key={preset.id} value={preset.id}>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      {preset.category}
                                    </Badge>
                                    <span>{preset.title}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                              Или создайте свою
                            </span>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="title">Название</Label>
                          <Input
                            id="title"
                            value={newTask.title}
                            onChange={(e) =>
                              setNewTask({ ...newTask, title: e.target.value })
                            }
                            placeholder="Введите название задачи"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Описание</Label>
                          <Textarea
                            id="description"
                            value={newTask.description}
                            onChange={(e) =>
                              setNewTask({ ...newTask, description: e.target.value })
                            }
                            placeholder="Добавьте детали"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="category">Категория</Label>
                            <Input
                              id="category"
                              value={newTask.category}
                              onChange={(e) =>
                                setNewTask({ ...newTask, category: e.target.value })
                              }
                              placeholder="Учеба, Проект, Встречи"
                            />
                          </div>
                          <div>
                            <Label htmlFor="priority">Приоритет</Label>
                            <Select
                              value={newTask.priority}
                              onValueChange={(value: 'high' | 'medium' | 'low') =>
                                setNewTask({ ...newTask, priority: value })
                              }
                            >
                              <SelectTrigger id="priority">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">Высокий</SelectItem>
                                <SelectItem value="medium">Средний</SelectItem>
                                <SelectItem value="low">Низкий</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button onClick={addTask} className="w-full" disabled={!newTask.title.trim()}>
                          <Icon name="Plus" size={18} className="mr-2" />
                          Создать задачу
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-4">
                  {tasks.filter((task) => !task.completed).length === 0 ? (
                    <Card className="p-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                          <Icon name="ListTodo" size={40} className="text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Пока нет задач</h3>
                          <p className="text-muted-foreground mb-6">
                            Начните добавлять задачи, чтобы эффективно управлять своим временем
                          </p>
                          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                              <Button size="lg" className="gap-2">
                                <Icon name="Plus" size={20} />
                                Создать первую задачу
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Новая задача</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 mt-4">
                                <div>
                                  <Label htmlFor="preset-empty">Выберите задачу из списка</Label>
                                  <Select value={selectedPreset} onValueChange={handlePresetSelect}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Или выберите готовую задачу..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {presetTasks.map((preset) => (
                                        <SelectItem key={preset.id} value={preset.id}>
                                          <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-xs">
                                              {preset.category}
                                            </Badge>
                                            <span>{preset.title}</span>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="relative">
                                  <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                  </div>
                                  <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                      Или создайте свою
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="title-empty">Название</Label>
                                  <Input
                                    id="title-empty"
                                    value={newTask.title}
                                    onChange={(e) =>
                                      setNewTask({ ...newTask, title: e.target.value })
                                    }
                                    placeholder="Введите название задачи"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="description-empty">Описание</Label>
                                  <Textarea
                                    id="description-empty"
                                    value={newTask.description}
                                    onChange={(e) =>
                                      setNewTask({ ...newTask, description: e.target.value })
                                    }
                                    placeholder="Добавьте детали"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="category-empty">Категория</Label>
                                    <Input
                                      id="category-empty"
                                      value={newTask.category}
                                      onChange={(e) =>
                                        setNewTask({ ...newTask, category: e.target.value })
                                      }
                                      placeholder="Учеба, Проект, Встречи"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="priority-empty">Приоритет</Label>
                                    <Select
                                      value={newTask.priority}
                                      onValueChange={(value: 'high' | 'medium' | 'low') =>
                                        setNewTask({ ...newTask, priority: value })
                                      }
                                    >
                                      <SelectTrigger id="priority-empty">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="high">Высокий</SelectItem>
                                        <SelectItem value="medium">Средний</SelectItem>
                                        <SelectItem value="low">Низкий</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <Button onClick={() => { addTask(); setIsDialogOpen(false); }} className="w-full" disabled={!newTask.title.trim()}>
                                  <Icon name="Plus" size={18} className="mr-2" />
                                  Создать задачу
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    filteredTasks
                      .filter((task) => !task.completed)
                      .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
                      .map((task, index) => (
                      <Card
                        key={task.id}
                        className="p-6 hover:shadow-lg transition-all cursor-pointer animate-slide-up"
                        style={{animationDelay: `${index * 0.1}s`}}
                      >
                        <div className="flex items-start gap-4">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => toggleTask(task.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-lg mb-1">
                                  {task.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {task.description}
                                </p>
                              </div>
                              <Badge className={getPriorityColor(task.priority)}>
                                {getPriorityLabel(task.priority)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-4 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Icon name="Calendar" size={16} />
                                <span>
                                  {task.deadline.toLocaleDateString('ru-RU', {
                                    day: 'numeric',
                                    month: 'long',
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-primary">
                                <Icon name="Clock" size={16} />
                                <span className="font-medium">
                                  {getTimeUntilDeadline(task.deadline)}
                                </span>
                              </div>
                              <Badge variant="outline">{task.category}</Badge>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Icon name="Bell" size={20} className="text-primary" />
                    Напоминания
                  </h3>
                  <div className="space-y-3">
                    {tasks.filter((task) => !task.completed).length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Напоминания появятся после добавления задач
                      </p>
                    ) : (
                      tasks
                        .filter((task) => !task.completed)
                        .slice(0, 3)
                        .map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{task.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {getTimeUntilDeadline(task.deadline)}
                              </p>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Статистика</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Всего задач
                      </span>
                      <span className="font-bold">{tasks.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Выполнено
                      </span>
                      <span className="font-bold text-primary">
                        {completedTasksCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        В процессе
                      </span>
                      <span className="font-bold text-secondary-foreground">
                        {tasks.length - completedTasksCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Icon name="Sparkles" size={16} className="text-accent" />
                        Очки
                      </span>
                      <span className="font-bold text-accent text-lg">{points}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Icon name="PieChart" size={20} className="text-primary" />
                    По категориям
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(getCategoryStats()).map(([cat, count]) => {
                      const total = tasks.filter(t => t.category === cat).length;
                      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                      return (
                        <div key={cat} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{cat}</span>
                            <span className="font-medium">{count}/{total}</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                    {Object.keys(getCategoryStats()).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Статистика появится после выполнения задач
                      </p>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Моё расписание</h2>
              <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Icon name="Plus" size={18} />
                    Добавить занятие
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Новое занятие</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="time">Время</Label>
                      <Input
                        id="time"
                        type="time"
                        placeholder="09:00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="event">Название</Label>
                      <Input
                        id="event"
                        placeholder="Лекция по математике"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Тип</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lecture">Лекция</SelectItem>
                          <SelectItem value="seminar">Семинар</SelectItem>
                          <SelectItem value="lab">Лабораторная</SelectItem>
                          <SelectItem value="meeting">Встреча</SelectItem>
                          <SelectItem value="break">Перерыв</SelectItem>
                          <SelectItem value="other">Другое</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full">
                      Добавить
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-4">
              {schedule.length === 0 ? (
                <Card className="p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                      <Icon name="CalendarDays" size={40} className="text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Расписание пусто</h3>
                      <p className="text-muted-foreground mb-6">
                        Добавьте свои занятия и события
                      </p>
                      <Button onClick={() => setShowScheduleDialog(true)} className="gap-2">
                        <Icon name="Plus" size={20} />
                        Создать первое занятие
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                schedule.map((item, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-lg transition-all animate-slide-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0 w-20">
                      <p className="text-2xl font-bold text-primary">{item.time}</p>
                    </div>
                    <div className="w-1 h-12 bg-gradient-to-b from-primary to-secondary rounded-full" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.event}</h3>
                      <Badge variant="outline" className="mt-2">
                        {item.type === 'lecture' && 'Лекция'}
                        {item.type === 'seminar' && 'Семинар'}
                        {item.type === 'lab' && 'Лабораторная'}
                        {item.type === 'meeting' && 'Встреча'}
                        {item.type === 'break' && 'Перерыв'}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeScheduleItem(item.id)}
                    >
                      <Icon name="Trash2" size={18} className="text-destructive" />
                    </Button>
                  </div>
                </Card>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Календарь событий</h2>
              <Dialog open={showDateDialog} onOpenChange={setShowDateDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Icon name="Plus" size={18} />
                    Добавить важную дату
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Важная дата</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="date-title">Название</Label>
                      <Input
                        id="date-title"
                        placeholder="Экзамен по математике"
                      />
                    </div>
                    <div>
                      <Label htmlFor="date-description">Описание</Label>
                      <Textarea
                        id="date-description"
                        placeholder="Подробности события"
                      />
                    </div>
                    <Button className="w-full">
                      Сохранить
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-lg"
                />
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">
                  События на{' '}
                  {selectedDate?.toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                  })}
                </h3>
                <div className="space-y-3">
                  {tasks
                    .filter(
                      (task) =>
                        task.deadline.toDateString() === selectedDate?.toDateString()
                    )
                    .map((task) => (
                      <div
                        key={task.id}
                        className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {task.description}
                            </p>
                          </div>
                          <Badge className={getPriorityColor(task.priority)}>
                            {getPriorityLabel(task.priority)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  {tasks.filter(
                    (task) =>
                      task.deadline.toDateString() === selectedDate?.toDateString()
                  ).length === 0 && (
                    <p className="text-muted-foreground text-center py-8">
                      Нет событий на эту дату
                    </p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Dialog open={showCourseDialog} onOpenChange={setShowCourseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Добро пожаловать!</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <p className="text-muted-foreground">
              Выберите курс, чтобы начать планировать свои задачи
            </p>
            <div className="grid grid-cols-2 gap-3">
              {['1', '2', '3', '4'].map((course) => (
                <Button
                  key={course}
                  variant="outline"
                  size="lg"
                  onClick={() => handleCourseSelect(course)}
                  className="h-20 text-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <div className="flex flex-col items-center gap-1">
                    <Icon name="GraduationCap" size={24} />
                    <span>{course} курс</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showShopDialog} onOpenChange={setShowShopDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Icon name="ShoppingBag" size={24} />
              Магазин тем
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <Card className="p-4 bg-gradient-to-r from-accent/10 to-primary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <Icon name="Sparkles" size={24} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ваши очки</p>
                    <p className="text-2xl font-bold">{points}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">+100 за задачу</p>
                  <p className="text-xs text-muted-foreground">10000 за тему</p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {themes.map((theme) => (
                <Card
                  key={theme.id}
                  className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                    currentTheme === theme.id ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg">{theme.name}</h4>
                      {currentTheme === theme.id && (
                        <Badge className="bg-primary">
                          Активна
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {Object.values(theme.colors).map((color, i) => (
                        <div
                          key={i}
                          className="w-12 h-12 rounded-full border-2 border-border"
                          style={{
                            background: `hsl(${color})`,
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center gap-2">
                        <Icon name="Sparkles" size={16} className="text-accent" />
                        <span className="font-bold">{theme.price}</span>
                      </div>
                      {currentTheme === theme.id ? (
                        <Button disabled variant="outline">
                          Используется
                        </Button>
                      ) : theme.price === 0 ? (
                        <Button onClick={() => buyTheme(theme.id)}>
                          Применить
                        </Button>
                      ) : points >= theme.price ? (
                        <Button onClick={() => buyTheme(theme.id)}>
                          Купить
                        </Button>
                      ) : (
                        <Button disabled variant="outline">
                          Недостаточно очков
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showTipsDialog} onOpenChange={setShowTipsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Icon name="Lightbulb" size={24} className="text-accent" />
              Как использовать платформу
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Icon name="Target" size={20} className="text-primary" />
                Установка приоритетов задач
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Используйте систему приоритетов для эффективного планирования:
              </p>
              <ul className="text-sm space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <Badge className="bg-primary text-primary-foreground mt-0.5">Высокий</Badge>
                  <span>Срочные дела с ближайшим дедлайном или высокой важностью</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge className="bg-secondary text-secondary-foreground mt-0.5">Средний</Badge>
                  <span>Обычные задачи, которые нужно выполнить в течение недели</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge className="bg-muted text-muted-foreground mt-0.5">Низкий</Badge>
                  <span>Несрочные дела, которые можно отложить</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-secondary/10 to-primary/10">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Icon name="FolderKanban" size={20} className="text-secondary-foreground" />
                Категории задач
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Разделяйте задачи по категориям для лучшей организации:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Icon name="BookOpen" size={18} className="text-primary" />
                  <span className="text-sm font-medium">Учеба</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Briefcase" size={18} className="text-primary" />
                  <span className="text-sm font-medium">Проекты</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Users" size={18} className="text-primary" />
                  <span className="text-sm font-medium">Встречи</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Heart" size={18} className="text-primary" />
                  <span className="text-sm font-medium">Личное</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-accent/10 to-secondary/10">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Icon name="Sparkles" size={20} className="text-accent" />
                Система мотивации
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Зарабатывайте очки и меняйте внешний вид платформы:
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <Icon name="CheckCircle2" size={16} className="text-primary" />
                  <span><strong>+100 очков</strong> за каждую выполненную задачу</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="ShoppingBag" size={16} className="text-accent" />
                  <span><strong>10 000 очков</strong> — покупка новой темы оформления</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Palette" size={16} className="text-secondary-foreground" />
                  <span>6 уникальных цветовых тем на выбор</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Icon name="TrendingUp" size={20} className="text-primary" />
                Повышение продуктивности
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Советы для эффективного управления временем:
              </p>
              <ul className="text-sm space-y-2 ml-4 list-disc">
                <li>Планируйте день с вечера — добавляйте задачи заранее</li>
                <li>Начинайте с самых важных задач утром</li>
                <li>Разбивайте большие задачи на маленькие подзадачи</li>
                <li>Делайте перерывы каждые 45-60 минут</li>
                <li>Используйте категории для баланса учёбы и личной жизни</li>
                <li>Отмечайте выполненные задачи сразу — получайте очки!</li>
              </ul>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-secondary/10 to-accent/10">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Icon name="Calendar" size={20} className="text-secondary-foreground" />
                Работа с расписанием и календарём
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Используйте все возможности планирования:
              </p>
              <ul className="text-sm space-y-2 ml-4 list-disc">
                <li><strong>Расписание:</strong> Добавьте свои пары и занятия для удобного просмотра</li>
                <li><strong>Календарь:</strong> Отмечайте важные даты — экзамены, сдачу проектов</li>
                <li><strong>Напоминания:</strong> Следите за ближайшими дедлайнами в боковой панели</li>
              </ul>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;