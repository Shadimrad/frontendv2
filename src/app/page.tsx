'use client';

import { useState } from 'react';
import Dashboard from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Sprint } from '@/components/dashboard/types';

export default function Home() {
  const [view, setView] = useState<'home' | 'sprint'>('home');
  const [currentSprint, setCurrentSprint] = useState<Sprint | undefined>();
  const [sprints, setSprints] = useState<Sprint[]>([]);

  const handleSaveSprint = (sprint: Sprint) => {
    if (currentSprint) {
      // Update existing sprint
      setSprints(sprints.map(s => 
        s.name === currentSprint.name ? sprint : s
      ));
    } else {
      // Add new sprint
      setSprints([...sprints, sprint]);
    }
    setCurrentSprint(sprint);
    setView('sprint');
  };

  if (view === 'home') {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Sprints</h1>
          <Button 
            onClick={() => {
              setCurrentSprint(undefined);
              setView('sprint');
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Sprint
          </Button>
        </div>

        <div className="grid gap-4">
          {sprints.map((sprint) => (
            <div 
              key={sprint.name}
              className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center"
              onClick={() => {
                setCurrentSprint(sprint);
                setView('sprint');
              }}
            >
              <div>
                <h2 className="font-semibold">{sprint.name}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {sprint.habits.length} habits
              </div>
            </div>
          ))}

          {sprints.length === 0 && (
            <div className="text-center p-8 text-gray-500">
              No sprints yet. Create your first sprint!
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Dashboard
        mode={currentSprint ? 'view' : 'create'}
        initialSprint={currentSprint}
        onSave={handleSaveSprint}
        onCancel={() => {
          setView('home');
          setCurrentSprint(undefined);
        }}
        onBack={() => {
          setView('home');
          setCurrentSprint(undefined);
        }}
      />
    </div>
  );
}