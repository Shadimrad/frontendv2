import { useState, useEffect } from 'react';
import { Edit2, Home } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sprint, DailyEfforts } from '../types';
import Heatmap from './Heatmap';
import EffortLogger from './EffortLogger';

interface SprintViewProps {
  sprint: Sprint & { dailyEfforts: Record<string, DailyEfforts> };
  onEdit: () => void;
  onNew: () => void;
  onHome: () => void;
  onSave: (updatedSprint: Sprint & { dailyEfforts: Record<string, DailyEfforts> }) => void;
}

const SprintView = ({ sprint, onEdit, onNew, onHome, onSave }: SprintViewProps) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(sprint.startDate));
  const [localSprint, setLocalSprint] = useState(sprint);
  const [dailyEfforts, setDailyEfforts] = useState<Record<string, DailyEfforts>>(
    sprint.dailyEfforts || {}
  );
  const [currentDayEfforts, setCurrentDayEfforts] = useState<DailyEfforts>({});

  // Update local sprint when prop changes
  useEffect(() => {
    setLocalSprint(sprint);
    setDailyEfforts(sprint.dailyEfforts || {});
  }, [sprint]);

  const getDayKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const calculateDailyScore = (efforts: DailyEfforts): number => {
    if (!localSprint?.habits?.length) return 0;
    const totalWeight = localSprint.habits.reduce((sum, habit) => sum + Number(habit.weight), 0);
    if (totalWeight === 0) return 0;
    
    const score = localSprint.habits.reduce((score, habit) => {
      const effort = efforts[habit.name] || 0;
      const progress = Math.min(Number(effort) / Number(habit.targetHours), 1);
      return score + (progress * Number(habit.weight));
    }, 0);

    return (score / totalWeight) * 100;
  };

  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    const dayKey = getDayKey(date);
    setCurrentDayEfforts(dailyEfforts[dayKey] || {});
  };

  const handleSaveEffort = () => {
    const dayKey = getDayKey(currentDate);
    const updatedDailyEfforts = {
      ...dailyEfforts,
      [dayKey]: currentDayEfforts
    };
    
    const score = calculateDailyScore(currentDayEfforts);
    const dayIndex = Math.floor(
      (currentDate.getTime() - new Date(localSprint.startDate).getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    
    if (dayIndex >= 0 && dayIndex < localSprint.days.length) {
      const newDays = [...localSprint.days];
      newDays[dayIndex] = score;
      
      const updatedSprint = {
        ...localSprint,
        days: newDays,
        dailyEfforts: updatedDailyEfforts
      };
      
      setLocalSprint(updatedSprint);
      setDailyEfforts(updatedDailyEfforts);
      onSave(updatedSprint);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{localSprint.name}</CardTitle>
          <div className="space-x-2">
            <Button variant="outline" onClick={onHome}>
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button variant="outline" onClick={onEdit}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Sprint
            </Button>
            <Button variant="default" onClick={onNew}>New Sprint</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Heatmap 
            days={localSprint.days}
            startDate={localSprint.startDate}
            onDayClick={handleDayClick}
          />
          <EffortLogger
            habits={localSprint.habits}
            currentDate={currentDate}
            onDateChange={handleDayClick}
            dailyEfforts={currentDayEfforts}
            onEffortChange={setCurrentDayEfforts}
          />
          <Button 
            className="w-full"
            onClick={handleSaveEffort}
          >
            Save Effort
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SprintView;