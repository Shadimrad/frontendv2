import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, Home } from 'lucide-react';
import DatePickers from './DatePickers';
import HabitForm from './HabitForm';
import HabitList from './HabitList';
import { Sprint, Habit } from '../types';

interface CreateEditFormProps {
  initialData?: Sprint;
  onSave: (sprint: Sprint) => void;
  onCancel: () => void;
  onHome: () => void;
}

const CreateEditForm = ({ 
  initialData, 
  onSave, 
  onCancel,
  onHome 
}: CreateEditFormProps) => {
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(
    initialData ? new Date(initialData.startDate) : undefined
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(
    initialData ? new Date(initialData.endDate) : undefined
  );
  const [sprintData, setSprintData] = useState<Sprint>(initialData || {
    name: '',
    startDate: '',
    endDate: '',
    habits: [],
    days: []
  });
  const [newHabit, setNewHabit] = useState<Habit>({
    name: '',
    weight: '',
    targetHours: ''
  });

  const handleSave = () => {
    if (!sprintData.name || !selectedStartDate || !selectedEndDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    const daysDiff = Math.ceil(
      (selectedEndDate.getTime() - selectedStartDate.getTime()) / 
      (1000 * 60 * 60 * 24)
    ) + 1; // Include both start and end dates
    
    let newDays: (number | null)[];
    
    if (initialData) {
      // If editing, preserve existing data and extend/shrink the days array
      newDays = Array(daysDiff).fill(null);
      
      // Copy over existing days data
      initialData.days.forEach((day, index) => {
        if (index < newDays.length) {
          newDays[index] = day;
        }
      });
    } else {
      // If creating new, fill with nulls
      newDays = Array(daysDiff).fill(null);
    }
    
    const finalSprintData = {
      ...sprintData,
      startDate: selectedStartDate.toISOString(),
      endDate: selectedEndDate.toISOString(),
      days: newDays,
      habits: sprintData.habits // Ensure habits are included
    };
    
    onSave(finalSprintData);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {initialData ? 'Edit Sprint' : 'Create New Sprint'}
          </CardTitle>
          <div className="space-x-2">
            <Button variant="outline" onClick={onHome}>
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Sprint Name</label>
            <Input 
              placeholder="Enter sprint name"
              value={sprintData.name}
              onChange={(e) => setSprintData({ ...sprintData, name: e.target.value })}
            />
          </div>

          <DatePickers
            selectedStartDate={selectedStartDate}
            selectedEndDate={selectedEndDate}
            onStartDateChange={(date) => {
              setSelectedStartDate(date);
              if (date) {
                setSprintData({
                  ...sprintData,
                  startDate: date.toISOString()
                });
              }
            }}
            onEndDateChange={(date) => {
              setSelectedEndDate(date);
              if (date) {
                setSprintData({
                  ...sprintData,
                  endDate: date.toISOString()
                });
              }
            }}
          />

          <div className="space-y-4">
            <HabitList
              habits={sprintData.habits}
              onDelete={(index) => {
                setSprintData({
                  ...sprintData,
                  habits: sprintData.habits.filter((_, i) => i !== index)
                });
              }}
              totalWeight={sprintData.habits.reduce((sum, habit) => sum + Number(habit.weight), 0)}
            />

            <HabitForm
              habit={newHabit}
              onChange={setNewHabit}
              onAdd={() => {
                if (!newHabit.name || !newHabit.weight || !newHabit.targetHours) {
                  alert('Please fill in all habit fields');
                  return;
                }
                
                setSprintData({
                  ...sprintData,
                  habits: [...sprintData.habits, { ...newHabit }]
                });
                setNewHabit({ name: '', weight: '', targetHours: '' });
              }}
              totalWeight={sprintData.habits.reduce((sum, habit) => sum + Number(habit.weight), 0)}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              className="flex-1" 
              onClick={handleSave}
              disabled={!sprintData.name || !selectedStartDate || !selectedEndDate || sprintData.habits.length === 0}
            >
              {initialData ? 'Save Changes' : 'Create Sprint'}
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateEditForm;