import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Avatar, Rank } from '@/types';

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  avatars: Avatar[];
  selectedAvatar: string;
  onAvatarChange: (avatarId: string) => void;
  currentRank: Rank;
  nextRank: Rank | null;
  ranks: Rank[];
  completedTasksTotal: number;
  points: number;
  studentCourse: string;
  getRankProgress: () => number;
}

export function ProfileDialog({
  open,
  onOpenChange,
  avatars,
  selectedAvatar,
  onAvatarChange,
  currentRank,
  nextRank,
  ranks,
  completedTasksTotal,
  points,
  studentCourse,
  getRankProgress,
}: ProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Icon name="User" size={24} className="text-primary" />
            Мой профиль
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          <div className="flex flex-col lg:flex-row items-center gap-6 p-6 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-xl">
            <div className="relative flex flex-col items-center gap-3">
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <span className="text-5xl">{avatars.find(a => a.id === selectedAvatar)?.emoji}</span>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-md">
                  <Icon name={currentRank.icon as any} size={20} className="text-primary" />
                </div>
              </div>
              <div className="flex gap-2">
                {avatars.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => onAvatarChange(avatar.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      selectedAvatar === avatar.id
                        ? 'bg-primary/20 ring-2 ring-primary scale-110'
                        : 'bg-muted hover:bg-muted/70'
                    }`}
                    title={avatar.name}
                  >
                    <span className="text-xl">{avatar.emoji}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 text-center lg:text-left">
              <h3 className="text-2xl font-bold mb-1">{currentRank.title}</h3>
              <p className="text-muted-foreground mb-3">{studentCourse} курс</p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <div className="flex items-center gap-2">
                  <Icon name="CheckCircle2" size={18} className="text-primary" />
                  <span className="font-semibold">{completedTasksTotal} задач выполнено</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Sparkles" size={18} className="text-accent" />
                  <span className="font-semibold">{points} очков</span>
                </div>
              </div>
            </div>
          </div>

          {nextRank && (
            <Card className="p-6">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - getRankProgress() / 100)}`}
                      className="text-primary transition-all duration-500"
                      strokeLinecap="round"
                    />
                    <text
                      x="64"
                      y="64"
                      textAnchor="middle"
                      dy="0.3em"
                      className="text-2xl font-bold fill-current"
                      transform="rotate(90 64 64)"
                    >
                      {Math.round(getRankProgress())}%
                    </text>
                  </svg>
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <h4 className="font-semibold text-xl mb-2">Прогресс до следующего звания</h4>
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                    <Badge variant="outline" className="text-base px-3 py-1">
                      {completedTasksTotal} / {nextRank.tasks}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-3 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Icon name={nextRank.icon as any} size={24} className="text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground">Следующее звание</p>
                      <p className="font-bold text-lg">{nextRank.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Осталось <strong className="text-primary">{nextRank.tasks - completedTasksTotal}</strong> задач
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-6">
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Icon name="Award" size={20} className="text-accent" />
              Все достижения
            </h4>
            <div className="space-y-3">
              {ranks.map((rank, index) => {
                const isUnlocked = completedTasksTotal >= rank.tasks;
                const isNext = !isUnlocked && nextRank?.title === rank.title;
                
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                      isUnlocked
                        ? 'bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20'
                        : isNext
                        ? 'bg-muted/30 border-muted-foreground/20 border-dashed'
                        : 'bg-muted/10 border-muted-foreground/10 opacity-50'
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center ${
                        isUnlocked
                          ? 'bg-gradient-to-br from-primary to-accent shadow-md'
                          : 'bg-muted'
                      }`}
                    >
                      <Icon
                        name={rank.icon as any}
                        size={24}
                        className={isUnlocked ? 'text-white' : 'text-muted-foreground'}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className={`font-semibold ${isUnlocked ? rank.color : 'text-muted-foreground'}`}>
                          {rank.title}
                        </h5>
                        {isUnlocked && (
                          <Badge variant="default" className="text-xs">
                            Получено
                          </Badge>
                        )}
                        {isNext && (
                          <Badge variant="outline" className="text-xs">
                            Следующее
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Выполнить {rank.tasks} задач
                      </p>
                    </div>
                    {isUnlocked && (
                      <Icon name="Check" size={24} className="text-primary" />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {completedTasksTotal >= 1000 && (
            <Card className="p-6 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/20">
              <div className="flex items-center gap-4">
                <Icon name="Crown" size={32} className="text-yellow-500" />
                <div>
                  <h4 className="font-bold text-xl text-yellow-600">Поздравляем!</h4>
                  <p className="text-muted-foreground">
                    Вы достигли максимального звания и стали мастером продуктивности! 🎉
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}