
'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const completedTasks = [
  {
    id: 'TASK-005',
    title: 'Create the project boilerplate',
    type: 'Task',
    project: 'Indus Nova',
    completedBy: 'Alia Bhatt',
  },
  {
    id: 'STORY-001',
    title: 'User sign up with email',
    type: 'Story',
    project: 'Indus Nova',
    completedBy: 'Ranbir Kapoor',
  },
  {
    id: 'BUG-001',
    title: 'Password reset link is not working',
    type: 'Bug',
    project: 'Indus Nova',
    completedBy: 'Deepika Padukone',
  },
  {
    id: 'STORY-003',
    title: 'Project summary on dashboard',
    type: 'Story',
    project: 'Project Phoenix',
    completedBy: 'Shah Rukh Khan',
  },
];

const releaseVersions = [
  '1.0.0', '1.0.1', '1.1.0', '2.0.0',
];

export default function ReleaseNotesPage() {
  const [selectedVersion, setSelectedVersion] = useState('1.0.0');

  const filteredTasks = completedTasks.filter(task => {
    // In a real application, this would filter based on tasks completed within a release cycle
    // For this example, we'll just show all tasks for simplicity
    return true;
  });

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Release Notes</h1>

      <div className="mb-6 flex items-center space-x-4">
        <label htmlFor="version-select" className="text-lg font-medium">Select Version:</label>
        <Select onValueChange={setSelectedVersion} defaultValue={selectedVersion}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a version" />
          </SelectTrigger>
          <SelectContent>
            {releaseVersions.map(version => (
              <SelectItem key={version} value={version}>{version}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Release Notes for Version {selectedVersion}</h2>
        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div key={task.id} className="border-b pb-3 last:border-b-0">
                <p className="font-medium">[{task.project}] {task.title} ({task.type})</p>
                <p className="text-sm text-gray-600">Completed by: {task.completedBy}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No completed tasks for this release.</p>
          )}
        </div>
      </div>
    </div>
  );
}
