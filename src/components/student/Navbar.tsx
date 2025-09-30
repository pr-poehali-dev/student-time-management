import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Avatar, Rank } from '@/types';

interface NavbarProps {
  studentCourse: string;
  avatars: Avatar[];
  selectedAvatar: string;
  currentRank: Rank;
  completedTasksTotal: number;
  points: number;
  activeTab: 'dashboard' | 'schedule' | 'calendar';
  onProfileClick: () => void;
  onShopClick: () => void;
  onCourseClick: () => void;
  onTipsClick: () => void;
  onTabChange: (tab: 'dashboard' | 'schedule' | 'calendar') => void;
}

export function Navbar({
  studentCourse,
  avatars,
  selectedAvatar,
  currentRank,
  completedTasksTotal,
  points,
  activeTab,
  onProfileClick,
  onShopClick,
  onCourseClick,
  onTipsClick,
  onTabChange,
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 glass-effect shadow-soft">
      <div className="container mx-auto px-4 lg:px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-soft">
                <Icon name="GraduationCap" size={24} className="text-white" />
              </div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold gradient-text leading-tight">
                Student Time Manager
              </h1>
            </div>
            {studentCourse && (
              <>
                <Button
                  variant="ghost"
                  onClick={onProfileClick}
                  className="gap-2 px-3 py-2 h-auto hover:bg-primary/5"
                >
                  <div className="flex items-center gap-2">
                    <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
                      <span className="text-2xl">{avatars.find(a => a.id === selectedAvatar)?.emoji}</span>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                        <Icon name={currentRank.icon as any} size={10} className="text-primary" />
                      </div>
                    </div>
                    <div className="hidden lg:flex flex-col items-start">
                      <span className="text-xs text-muted-foreground">{currentRank.title}</span>
                      <span className="text-xs font-bold">{completedTasksTotal} задач</span>
                    </div>
                  </div>
                </Button>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg border border-accent/20">
                  <Icon name="Sparkles" size={18} className="text-accent" />
                  <span className="font-bold text-lg">{points}</span>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {studentCourse && (
              <>
                <Button
                  variant="outline"
                  onClick={onShopClick}
                  className="gap-2 shadow-soft hover:shadow-soft-lg transition-all"
                >
                  <Icon name="ShoppingBag" size={18} />
                  <span className="hidden lg:inline font-medium">Магазин</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onCourseClick}
                  className="hidden md:flex"
                >
                  <Icon name="Settings" size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onTipsClick}
                >
                  <Icon name="HelpCircle" size={18} />
                </Button>
              </>
            )}
            <div className="hidden md:flex items-center gap-1 ml-2 bg-muted/50 rounded-lg p-1">
              <Button
                variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onTabChange('dashboard')}
                className="gap-2"
              >
                <Icon name="LayoutDashboard" size={16} />
                <span className="hidden lg:inline">Главная</span>
              </Button>
              <Button
                variant={activeTab === 'schedule' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onTabChange('schedule')}
                className="gap-2"
              >
                <Icon name="CalendarDays" size={16} />
                <span className="hidden lg:inline">Расписание</span>
              </Button>
              <Button
                variant={activeTab === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onTabChange('calendar')}
                className="gap-2"
              >
                <Icon name="Calendar" size={16} />
                <span className="hidden lg:inline">Календарь</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}