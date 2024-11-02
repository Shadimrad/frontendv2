import { useState } from 'react';
import { DashboardProps, Sprint, DailyEfforts } from './types';
import CreateEditForm from './CreateEditForm';
import SprintView from './SprintView';

interface ExtendedSprint extends Sprint {
  dailyEfforts: Record<string, DailyEfforts>;
}

const Dashboard = ({
  mode,
  initialSprint,
  onSave,
  onCancel,
  onBack
}: DashboardProps) => {
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [currentView, setCurrentView] = useState<'view' | 'create' | 'edit'>(mode);
  const [sprintData, setSprintData] = useState<ExtendedSprint>({
    ...(initialSprint || {
      name: '',
      startDate: '',
      endDate: '',
      habits: [],
      days: [],
    }),
    dailyEfforts: (initialSprint as any)?.dailyEfforts || {}
  } as ExtendedSprint);

  const handleSave = (updatedSprint: Sprint) => {
    // Preserve existing dailyEfforts when saving edits
    const newSprintData = {
      ...updatedSprint,
      dailyEfforts: sprintData?.dailyEfforts || {}
    } as ExtendedSprint;
    
    setSprintData(newSprintData);
    onSave(newSprintData);
    setIsEditing(false);
    setCurrentView('view');
  };

  const handleSprintSave = (updatedSprint: Sprint & { dailyEfforts: Record<string, DailyEfforts> }) => {
    const newSprintData = {
      ...updatedSprint,
      dailyEfforts: updatedSprint.dailyEfforts || {}
    } as ExtendedSprint;
    
    setSprintData(newSprintData);
    onSave(newSprintData);
  };

  if (isEditing || currentView === 'create' || !sprintData) {
    return (
      <CreateEditForm
        initialData={isEditing ? sprintData : undefined}
        onSave={handleSave}
        onCancel={() => {
          if (currentView === 'create') {
            onCancel?.();
          } else {
            setIsEditing(false);
            setCurrentView('view');
          }
        }}
        onHome={onBack || (() => {})}
      />
    );
  }

  return (
    <SprintView
      sprint={sprintData}
      onEdit={() => {
        setIsEditing(true);
        setCurrentView('edit');
      }}
      onNew={() => {
        // Reset to a new sprint state
        setSprintData({
          name: '',
          startDate: '',
          endDate: '',
          habits: [],
          days: [],
          dailyEfforts: {}
        } as ExtendedSprint);
        setCurrentView('create');
      }}
      onHome={onBack || (() => {})}
      onSave={handleSprintSave}
    />
  );
};

export default Dashboard;