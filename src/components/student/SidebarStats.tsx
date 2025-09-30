import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Task } from '@/types';

interface SidebarStatsProps {
  tasks: Task[];
  points: number;
  getTimeUntilDeadline: (deadline: Date) => string;
  getCategoryStats: () => { [key: string]: number };
}

export function SidebarStats({
  tasks,
  points,
  getTimeUntilDeadline,
  getCategoryStats,
}: SidebarStatsProps) {
  const completedTasksCount = tasks.filter((task) => task.completed).length;

  return (
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
  );
}