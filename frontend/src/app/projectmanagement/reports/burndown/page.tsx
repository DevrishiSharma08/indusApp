
'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const burndownData = {
  'Sprint 1': [
    { day: 1, remaining: 100 },
    { day: 2, remaining: 90 },
    { day: 3, remaining: 80 },
    { day: 4, remaining: 70 },
    { day: 5, remaining: 60 },
    { day: 6, remaining: 50 },
    { day: 7, remaining: 40 },
    { day: 8, remaining: 30 },
    { day: 9, remaining: 20 },
    { day: 10, remaining: 0 },
  ],
  'Sprint 2': [
    { day: 1, remaining: 120 },
    { day: 2, remaining: 110 },
    { day: 3, remaining: 100 },
    { day: 4, remaining: 90 },
    { day: 5, remaining: 80 },
    { day: 6, remaining: 70 },
    { day: 7, remaining: 60 },
    { day: 8, remaining: 50 },
    { day: 9, remaining: 40 },
    { day: 10, remaining: 30 },
  ],
};

export default function BurndownChartPage() {
  const [selectedSprint, setSelectedSprint] = useState('Sprint 1');
  const data = burndownData[selectedSprint as keyof typeof burndownData];

  const maxRemaining = Math.max(...data.map(d => d.remaining));
  const maxDay = Math.max(...data.map(d => d.day));

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Burndown Chart</h1>

      <div className="mb-6 flex items-center space-x-4">
        <label htmlFor="sprint-select" className="text-lg font-medium">Select Sprint:</label>
        <Select onValueChange={setSelectedSprint} defaultValue={selectedSprint}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a sprint" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(burndownData).map(sprintName => (
              <SelectItem key={sprintName} value={sprintName}>{sprintName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">{selectedSprint} Burndown</h2>
        <div className="relative h-80 w-full">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between py-2 text-right text-sm text-gray-500">
            <span>{maxRemaining}</span>
            <span>{maxRemaining / 2}</span>
            <span>0</span>
          </div>
          {/* X-axis labels */}
          <div className="absolute left-10 right-0 bottom-0 h-6 flex justify-between px-2 text-sm text-gray-500">
            {data.map((_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>

          {/* Chart area */}
          <div className="absolute left-10 right-0 top-0 bottom-6 border-l border-b border-gray-300">
            {/* Ideal Burndown Line */}
            <div
              className="absolute top-0 left-0 w-full h-full border-t border-dashed border-gray-400"
              style={{ transform: 'rotate(0deg)', transformOrigin: 'top left' }}
            ></div>

            {/* Actual Burndown Line */}
            <svg className="absolute top-0 left-0 w-full h-full" viewBox={`0 0 ${maxDay} ${maxRemaining}`} preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
                points={data.map(d => `${d.day},${maxRemaining - d.remaining}`).join(' ')}
              />
            </svg>
          </div>
        </div>
        <div className="text-center mt-4 text-sm text-gray-600">Day</div>
      </div>
    </div>
  );
}
