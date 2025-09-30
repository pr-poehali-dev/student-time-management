import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { Task, Category } from '@/types';

interface TaskListProps {
  tasks: Task[];
  filteredTasks: Task[];
  selectedCategory: string;
  categories: Category[];
  onCategoryChange: (categoryId: string) => void;
  onTaskToggle: (taskId: number) => void;
  onAddTaskClick: () => void;
  getPriorityColor: (priority: string) => string;
  getPriorityLabel: (priority: string) => string;
  getTimeUntilDeadline: (deadline: Date) => string;
}

export function TaskList({
  tasks,
  filteredTasks,
  selectedCategory,
  categories,
  onCategoryChange,
  onTaskToggle,
  onAddTaskClick,
  getPriorityColor,
  getPriorityLabel,
  getTimeUntilDeadline,
}: TaskListProps) {
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl lg:text-3xl font-bold">Ближайшие дедлайны</h2>
        </div>
        <div className="flex gap-2 flex-wrap bg-muted/30 p-2 rounded-xl">
          {categories.map(cat => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onCategoryChange(cat.id)}
              className="gap-2 shadow-soft"
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
        <Button onClick={onAddTaskClick} className="gap-2 shadow-lg hover:shadow-xl transition-shadow">
          <Icon name="Plus" size={18} />
          Добавить задачу
        </Button>
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
                <Button size="lg" className="gap-2" onClick={onAddTaskClick}>
                  <Icon name="Plus" size={20} />
                  Создать первую задачу
                </Button>
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
                  onCheckedChange={() => onTaskToggle(task.id)}
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
    </>
  );
}