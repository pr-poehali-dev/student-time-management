export const getPriorityColor = (priority: string) => {
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

export const getPriorityLabel = (priority: string) => {
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

export const getTimeUntilDeadline = (deadline: Date) => {
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