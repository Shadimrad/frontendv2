export interface Habit {
    name: string;
    weight: string | number;
    targetHours: string | number;
  }
  
  export interface Sprint {
    name: string;
    startDate: string;
    endDate: string;
    habits: Habit[];
    days: (number | null)[];
  }
  
  export interface DailyEfforts {
    [key: string]: number;
  }
  
  export interface DashboardProps {
    mode: 'create' | 'view' | 'edit';
    initialSprint?: Sprint;
    onSave: (sprint: Sprint) => void;
    onCancel?: () => void;
    onBack?: () => void;
  }