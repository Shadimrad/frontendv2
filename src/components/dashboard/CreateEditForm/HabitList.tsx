import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Habit } from "../types";

interface HabitListProps {
  habits: Habit[];
  onDelete: (index: number) => void;
  totalWeight: number;
}

const HabitList = ({ habits, onDelete, totalWeight }: HabitListProps) => {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          Total weight of all habits must not exceed 100%. Current total: {totalWeight}%
        </AlertDescription>
      </Alert>

      <Label>Habits</Label>
      {habits.map((habit, index) => (
        <div key={index} className="flex items-center gap-2 p-2 bg-gray-100 rounded">
          <span className="flex-1">{habit.name}</span>
          <span className="text-sm text-gray-600">Weight: {habit.weight}%</span>
          <span className="text-sm text-gray-600">Target: {habit.targetHours}h</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDelete(index)}
          >
            ×
          </Button>
        </div>
      ))}
    </div>
  );
};

export default HabitList;