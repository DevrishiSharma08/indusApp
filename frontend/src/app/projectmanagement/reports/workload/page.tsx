
'use client';

import { User } from 'lucide-react';

const teamMembers = [
  {
    id: 'U1',
    name: 'Alia Bhatt',
    assignedTasks: 8,
    completedTasks: 5,
    capacity: 10,
    avatar: '/avatars/01.png',
  },
  {
    id: 'U2',
    name: 'Ranbir Kapoor',
    assignedTasks: 12,
    completedTasks: 6,
    capacity: 10,
    avatar: '/avatars/02.png',
  },
  {
    id: 'U3',
    name: 'Deepika Padukone',
    assignedTasks: 7,
    completedTasks: 7,
    capacity: 10,
    avatar: '/avatars/03.png',
  },
  {
    id: 'U4',
    name: 'Shah Rukh Khan',
    assignedTasks: 9,
    completedTasks: 8,
    capacity: 10,
    avatar: '/avatars/04.png',
  },
];

export default function WorkloadReportPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Workload Report</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Team Member Workload</h2>
        <div className="space-y-6">
          {teamMembers.map(member => {
            const workloadPercentage = (member.assignedTasks / member.capacity) * 100;
            const isOverloaded = member.assignedTasks > member.capacity;
            return (
              <div key={member.id} className="flex items-center">
                <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full mr-4" />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold">{member.name}</p>
                    <p className={`text-sm ${isOverloaded ? 'text-red-600' : 'text-gray-600'}`}>
                      {member.assignedTasks} / {member.capacity} tasks assigned {isOverloaded && '(Overloaded)'}
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`${isOverloaded ? 'bg-red-500' : 'bg-blue-500'} h-2.5 rounded-full`}
                      style={{ width: `${Math.min(workloadPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
