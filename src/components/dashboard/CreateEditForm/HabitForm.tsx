import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Habit } from "../types";

interface HabitFormProps {
  habit: Habit;
  onChange: (habit: Habit) => void;
  onAdd: () => void;
  totalWeight: number;
}

const HabitForm = ({ habit, onChange, onAdd, totalWeight }: HabitFormProps) => {
  const validateNewHabit = (): boolean => {
    return totalWeight + Number(habit.weight) <= 100;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
      <div>
        <Label htmlFor="habit-name">Habit Name</Label>
        <Input 
          id="habit-name"
          placeholder="Name"
          value={habit.name}
          onChange={(e) => onChange({ ...habit, name: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="weight">Weight (%)</Label>
        <Input 
          id="weight"
          type="number"
          min="0"
          max="100"
          placeholder="Weight"
          value={habit.weight}
          onChange={(e) => onChange({ ...habit, weight: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="target">Target Hours</Label>
        <Input 
          id="target"
          type="number"
          min="0"
          max="24"
          placeholder="Hours"
          value={habit.targetHours}
          onChange={(e) => onChange({ ...habit, targetHours: e.target.value })}
        />
      </div>
      <Button 
        onClick={() => {
          if (!habit.name || !habit.weight || !habit.targetHours) return;
          if (!validateNewHabit()) {
            alert("Total weight cannot exceed 100%");
            return;
          }
          onAdd();
        }}
      >
        Add Habit
      </Button>
    </div>
  );
};

export default HabitForm;