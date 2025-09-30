import { useState } from 'react';
import { Navbar } from '@/components/student/Navbar';
import { ProfileDialog } from '@/components/student/ProfileDialog';
import { DashboardStats } from '@/components/student/DashboardStats';
import { TaskList } from '@/components/student/TaskList';
import { SidebarStats } from '@/components/student/SidebarStats';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import Icon from '@/components/ui/icon';
import { Task, ScheduleItem, ImportantDate, Theme } from '@/types';
import { presetTasks, avatars, categories, themes, ranks } from '@/data/constants';
import { getPriorityColor, getPriorityLabel, getTimeUntilDeadline } from '@/utils/taskHelpers';

const Index = () => {
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
  const [showProfileDialog, setShowProfileDialog] = useState<boolean>(false);
  const [completedTasksTotal, setCompletedTasksTotal] = useState<number>(0);
  const [selectedAvatar, setSelectedAvatar] = useState<string>('Cat');
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
    (task) => task.deadline.toDateString() === new Date().toDateString() && !task.completed
  );

  const upcomingTasks = tasks.filter(
    (task) =>
      task.deadline > new Date() &&
      task.deadline.toDateString() !== new Date().toDateString() &&
      !task.completed
  );

  const completedTasksCount = tasks.filter((task) => task.completed).length;
  const progressPercentage = tasks.length > 0 ? (completedTasksCount / tasks.length) * 100 : 0;
  
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

  const getCurrentRank = () => {
    for (let i = ranks.length - 1; i >= 0; i--) {
      if (completedTasksTotal >= ranks[i].tasks) {
        return ranks[i];
      }
    }
    return { title: 'Без звания', tasks: 0, icon: 'User', color: 'text-gray-400' };
  };

  const getNextRank = () => {
    for (let i = 0; i < ranks.length; i++) {
      if (completedTasksTotal < ranks[i].tasks) {
        return ranks[i];
      }
    }
    return null;
  };

  const getRankProgress = () => {
    const nextRank = getNextRank();
    if (!nextRank) return 100;
    const currentRank = getCurrentRank();
    const tasksForNextRank = nextRank.tasks - currentRank.tasks;
    const currentProgress = completedTasksTotal - currentRank.tasks;
    return (currentProgress / tasksForNextRank) * 100;
  };

  const toggleTask = (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      setPoints(prev => prev + 100);
      setCompletedTasksTotal(prev => prev + 1);
    }
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
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

  const removeScheduleItem = (id: number) => {
    setSchedule(schedule.filter(item => item.id !== id));
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-accent/5">
      <Navbar
        studentCourse={studentCourse}
        avatars={avatars}
        selectedAvatar={selectedAvatar}
        currentRank={getCurrentRank()}
        completedTasksTotal={completedTasksTotal}
        points={points}
        activeTab={activeTab}
        onProfileClick={() => setShowProfileDialog(true)}
        onShopClick={() => setShowShopDialog(true)}
        onCourseClick={() => setShowCourseDialog(true)}
        onTipsClick={() => setShowTipsDialog(true)}
        onTabChange={setActiveTab}
      />

      <main className="container mx-auto px-4 lg:px-6 py-8 lg:py-12">
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in space-y-8">
            <DashboardStats
              todayTasksCount={todayTasks.length}
              upcomingTasksCount={upcomingTasks.length}
              progressPercentage={progressPercentage}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="lg:col-span-2 space-y-6">
                <TaskList
                  tasks={tasks}
                  filteredTasks={filteredTasks}
                  selectedCategory={selectedCategory}
                  categories={categories}
                  onCategoryChange={setSelectedCategory}
                  onTaskToggle={toggleTask}
                  onAddTaskClick={() => setIsDialogOpen(true)}
                  getPriorityColor={getPriorityColor}
                  getPriorityLabel={getPriorityLabel}
                  getTimeUntilDeadline={getTimeUntilDeadline}
                />
              </div>

              <SidebarStats
                tasks={tasks}
                points={points}
                getTimeUntilDeadline={getTimeUntilDeadline}
                getCategoryStats={getCategoryStats}
              />
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Моё расписание</h2>
              <Button className="gap-2" onClick={() => setShowScheduleDialog(true)}>
                <Icon name="Plus" size={18} />
                Добавить занятие
              </Button>
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
              <Button className="gap-2" onClick={() => setShowDateDialog(true)}>
                <Icon name="Plus" size={18} />
                Добавить важную дату
              </Button>
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

      <ProfileDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
        avatars={avatars}
        selectedAvatar={selectedAvatar}
        onAvatarChange={setSelectedAvatar}
        currentRank={getCurrentRank()}
        nextRank={getNextRank()}
        ranks={ranks}
        completedTasksTotal={completedTasksTotal}
        points={points}
        studentCourse={studentCourse}
        getRankProgress={getRankProgress}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
            <Button onClick={() => { addTask(); setIsDialogOpen(false); }} className="w-full" disabled={!newTask.title.trim()}>
              <Icon name="Plus" size={18} className="mr-2" />
              Создать задачу
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;