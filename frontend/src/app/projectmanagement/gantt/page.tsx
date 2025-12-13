
'use client';

import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import FilterExportBar from '@/components/FilterExportBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const tasks = [
  {
    id: 'T1',
    name: 'Design Database',
    startDate: '2023-10-01',
    endDate: '2023-10-10',
    progress: 100,
  },
  {
    id: 'T2',
    name: 'Develop API',
    startDate: '2023-10-11',
    endDate: '2023-10-25',
    progress: 70,
  },
  {
    id: 'T3',
    name: 'Design UI',
    startDate: '2023-10-05',
    endDate: '2023-10-15',
    progress: 100,
  },
  {
    id: 'T4',
    name: 'Develop Frontend',
    startDate: '2023-10-16',
    endDate: '2023-11-10',
    progress: 40,
  },
  {
    id: 'T5',
    name: 'Integrate API & UI',
    startDate: '2023-10-26',
    endDate: '2023-11-20',
    progress: 10,
  },
];

const getDaysBetween = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;
};

const getOffsetDays = (projectStartDate: string, taskStartDate: string) => {
  const projStart = new Date(projectStartDate);
  const taskStart = new Date(taskStartDate);
  return (taskStart.getTime() - projStart.getTime()) / (1000 * 60 * 60 * 24);
};

export default function GanttChartPage() {
  const [view, setView] = useState('month');
  const projectStartDate = '2023-10-01';
  const projectEndDate = '2023-11-30';
  const totalProjectDays = getDaysBetween(projectStartDate, projectEndDate);

  const filterDefinitions = [
    {
      key: 'view',
      label: 'Timescale',
      options: [
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
      ],
    },
  ];

  const transformedFilters = filterDefinitions.map(def => ({
    ...def,
    value: view,
    onChange: setView,
  }));

  return (
    <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
      <PageHeader
        title="Gantt Chart"
        description="Visualize your project timeline and dependencies."
        primaryAction={{
          content: 'Add Task',
          onClick: () => console.log('Add new task'),
          icon: Plus,
        }}
      />

      <FilterExportBar filters={transformedFilters} showExport={false} />

      <Card className="mt-6">
        <CardContent className="p-4 overflow-x-auto">
          <div className="min-w-[1200px]">
            {/* Header for Dates */}
            <div className="grid grid-cols-[250px_1fr] gap-x-2 pb-2 border-b">
              <div className="font-semibold text-sm text-muted-foreground">Task Name</div>
              <div className="grid" style={{ gridTemplateColumns: `repeat(${totalProjectDays}, minmax(0, 1fr))` }}>
                {Array.from({ length: totalProjectDays }).map((_, i) => {
                  const date = new Date(projectStartDate);
                  date.setDate(date.getDate() + i);
                  return (
                    <div key={i} className="text-center text-xs text-muted-foreground border-l first:border-l-0">
                      <span className={date.getDate() === 1 ? 'font-bold' : ''}>{date.getDate()}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Task Rows */}
            <div className="grid grid-cols-[250px_1fr] gap-x-2 gap-y-3 pt-3">
              {tasks.map(task => {
                const taskDays = getDaysBetween(task.startDate, task.endDate);
                const offsetDays = getOffsetDays(projectStartDate, task.startDate);

                return (
                  <>
                    <div className="font-medium text-sm truncate pr-2">{task.name}</div>
                    <div className="relative h-8 flex items-center" style={{ gridColumnStart: 2, gridColumnEnd: 3 }}>
                        <div className="absolute w-full h-full" style={{ left: `${(offsetDays / totalProjectDays) * 100}%`, width: `${(taskDays / totalProjectDays) * 100}%`}}>
                            <div className="relative w-full h-full bg-primary/20 rounded-md border border-primary/50 flex items-center">
                                <Progress value={task.progress} className="h-full bg-primary/80" />
                                <span className="absolute w-full text-center text-xs font-semibold text-primary-foreground mix-blend-lighten px-2 truncate">
                                    {task.name} - {task.progress}%
                                </span>
                            </div>
                        </div>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
