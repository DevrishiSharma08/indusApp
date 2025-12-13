
'use client';

import { useState } from 'react';

const velocityData = [
  { sprint: 'Sprint 1', committed: 100, completed: 90 },
  { sprint: 'Sprint 2', committed: 120, completed: 110 },
  { sprint: 'Sprint 3', committed: 110, completed: 110 },
  { sprint: 'Sprint 4', committed: 130, completed: 100 },
  { sprint: 'Sprint 5', committed: 100, completed: 100 },
];

export default function VelocityChartPage() {
  const maxStoryPoints = Math.max(
    ...velocityData.map(d => Math.max(d.committed, d.completed))
  );

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Velocity Chart</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Team Velocity</h2>
        <div className="relative h-80 w-full">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between py-2 text-right text-sm text-gray-500">
            <span>{maxStoryPoints}</span>
            <span>{maxStoryPoints / 2}</span>
            <span>0</span>
          </div>

          {/* Chart area */}
          <div className="absolute left-10 right-0 top-0 bottom-6 border-l border-b border-gray-300 flex items-end justify-around px-2">
            {velocityData.map((dataPoint, index) => (
              <div key={index} className="flex flex-col items-center h-full justify-end mx-2">
                {/* Committed */}
                <div
                  className="w-8 bg-blue-400 rounded-t-lg"
                  style={{ height: `${(dataPoint.committed / maxStoryPoints) * 100}%` }}
                  title={`Committed: ${dataPoint.committed}`}
                ></div>
                {/* Completed */}
                <div
                  className="w-8 bg-blue-600 rounded-t-lg mt-1"
                  style={{ height: `${(dataPoint.completed / maxStoryPoints) * 100}%` }}
                  title={`Completed: ${dataPoint.completed}`}
                ></div>
                <span className="text-xs text-gray-600 mt-2">{dataPoint.sprint}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-4 space-x-4 text-sm">
            <div className="flex items-center">
                <span className="w-3 h-3 bg-blue-400 mr-2"></span>
                <span>Committed Story Points</span>
            </div>
            <div className="flex items-center">
                <span className="w-3 h-3 bg-blue-600 mr-2"></span>
                <span>Completed Story Points</span>
            </div>
        </div>
      </div>
    </div>
  );
}
