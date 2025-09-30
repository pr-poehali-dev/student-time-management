import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface DashboardStatsProps {
  todayTasksCount: number;
  upcomingTasksCount: number;
  progressPercentage: number;
}

export function DashboardStats({
  todayTasksCount,
  upcomingTasksCount,
  progressPercentage,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
      <Card className="p-6 lg:p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 card-hover shadow-soft smooth-shadow-hover animate-scale-in group">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base lg:text-lg font-semibold text-foreground/80">Задачи на сегодня</h3>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Icon name="CheckCircle2" size={24} className="text-primary" />
          </div>
        </div>
        <p className="text-4xl lg:text-5xl font-bold text-primary mb-2">{todayTasksCount}</p>
        <p className="text-sm text-muted-foreground">
          Требуют внимания
        </p>
      </Card>

      <Card className="p-6 lg:p-8 bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent border-secondary/20 card-hover shadow-soft smooth-shadow-hover animate-scale-in group" style={{animationDelay: '0.1s'}}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base lg:text-lg font-semibold text-foreground/80">Предстоящие</h3>
          <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
            <Icon name="Clock" size={24} className="text-secondary-foreground" />
          </div>
        </div>
        <p className="text-4xl lg:text-5xl font-bold text-secondary-foreground mb-2">
          {upcomingTasksCount}
        </p>
        <p className="text-sm text-muted-foreground">На этой неделе</p>
      </Card>

      <Card className="p-6 lg:p-8 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent border-accent/20 card-hover shadow-soft smooth-shadow-hover animate-scale-in group" style={{animationDelay: '0.2s'}}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base lg:text-lg font-semibold text-foreground/80">Прогресс</h3>
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
            <Icon name="TrendingUp" size={24} className="text-accent-foreground" />
          </div>
        </div>
        <p className="text-4xl lg:text-5xl font-bold text-accent-foreground mb-2">
          {Math.round(progressPercentage)}%
        </p>
        <Progress value={progressPercentage} className="mt-3 h-2" />
      </Card>
    </div>
  );
}