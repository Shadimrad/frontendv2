import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Habit, DailyEfforts } from "../types";

interface EffortLoggerProps {
  habits: Habit[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  dailyEfforts: DailyEfforts;
  onEffortChange: (efforts: DailyEfforts) => void;
}

const EffortLogger = ({
  habits,
  currentDate,
  onDateChange,
  dailyEfforts,
  onEffortChange
}: EffortLoggerProps) => {
  const calculateDailyScore = (): number => {
    return habits.reduce((score, habit) => {
      const effort = dailyEfforts[habit.name] || 0;
      const progress = Math.min(Number(effort) / Number(habit.targetHours), 1);
      return score + (progress * Number(habit.weight));
    }, 0);
  };

  const validateDailyHours = (newEfforts: DailyEfforts): boolean => {
    const totalHours = Object.values(newEfforts).reduce((sum, hours) => sum + hours, 0);
    return totalHours <= 24;
  };

  const handleEffortChange = (habitName: string, hours: number) => {
    const newEfforts = {
      ...dailyEfforts,
      [habitName]: hours
    };
    
    if (!validateDailyHours(newEfforts)) {
      alert("Total daily hours cannot exceed 24");
      return;
    }
    
    onEffortChange(newEfforts);
  };

  // Calculate total hours logged for the current day
  const totalHoursLogged = Object.values(dailyEfforts).reduce((sum, hours) => sum + (hours || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Log Effort for {format(currentDate, "PPP")}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("w-[200px] justify-start text-left font-normal")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(currentDate, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={(date) => date && onDateChange(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <Alert variant="default">
        <AlertDescription>
          Total hours logged today: {totalHoursLogged.toFixed(1)} / 24
        </AlertDescription>
      </Alert>

      {habits.map((habit, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center p-4 bg-gray-50 rounded-lg">
          <div className="space-y-1">
            <div className="font-medium">{habit.name}</div>
            <div className="text-sm text-gray-500">
              Target: {habit.targetHours}h | Weight: {habit.weight}%
            </div>
            <div className="text-sm text-gray-500">
              Progress: {Math.min(((dailyEfforts[habit.name] || 0) / Number(habit.targetHours)) * 100, 100).toFixed(1)}%
            </div>
          </div>
          <div className="space-y-2">
            <Input 
              type="number"
              min="0"
              max="24"
              step="0.5"
              placeholder="Hours spent"
              value={dailyEfforts[habit.name] || ''}
              onChange={(e) => handleEffortChange(habit.name, Number(e.target.value))}
              className="w-full"
            />
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all"
                style={{
                  width: `${Math.min(((dailyEfforts[habit.name] || 0) / Number(habit.targetHours)) * 100, 100)}%`
                }}
              />
            </div>
          </div>
        </div>
      ))}
      
      <Alert>
        <AlertDescription>
          Current daily score: {calculateDailyScore().toFixed(1)}%
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default EffortLogger;