
'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const roadmapItems = [
  {
    id: 'Q1-2024',
    quarter: 'Q1 2024',
    projects: [
      { id: 'P1', name: 'Indus Nova', status: 'In Progress', startDate: '2024-01-01', endDate: '2024-03-31', color: 'bg-primary' },
      { id: 'P2', name: 'Project Phoenix', status: 'Planning', startDate: '2024-02-01', endDate: '2024-04-30', color: 'bg-accent' },
    ],
  },
  {
    id: 'Q2-2024',
    quarter: 'Q2 2024',
    projects: [
      { id: 'P3', name: 'Quantum Leap', status: 'Upcoming', startDate: '2024-04-01', endDate: '2024-06-30', color: 'bg-secondary' },
      { id: 'P4', name: 'E-commerce Upgrade', status: 'In Progress', startDate: '2024-03-15', endDate: '2024-07-15', color: 'bg-primary' },
    ],
  },
  {
    id: 'Q3-2024',
    quarter: 'Q3 2024',
    projects: [
      { id: 'P5', name: 'Data Analytics Dashboard', status: 'Planning', startDate: '2024-07-01', endDate: '2024-09-30', color: 'bg-accent' },
    ],
  },
];

type Status = 'In Progress' | 'Planning' | 'Upcoming';

const statusVariant: { [key in Status]: 'secondary' | 'outline' | 'default' } = {
  'In Progress': 'secondary',
  'Planning': 'outline',
  'Upcoming': 'default',
};

export default function RoadmapPage() {
  const [currentQuarterIndex, setCurrentQuarterIndex] = useState(0);

  const currentQuarter = roadmapItems[currentQuarterIndex];

  const goToNextQuarter = () => {
    setCurrentQuarterIndex(prev => (prev + 1) % roadmapItems.length);
  };

  const goToPreviousQuarter = () => {
    setCurrentQuarterIndex(prev => (prev - 1 + roadmapItems.length) % roadmapItems.length);
  };

  return (
    <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
      <PageHeader
        title="Project Roadmap"
        primaryAction={{
          content: 'Add Project to Roadmap',
          onClick: () => console.log('Add project to roadmap'),
          icon: Plus,
        }}
      />

      {/* Quarter Navigation */}
      <div className="flex items-center justify-center mb-6 sm:mb-8">
        <Button
          onClick={goToPreviousQuarter}
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
        <h2 className="text-xl sm:text-2xl font-semibold mx-4 sm:mx-6">{currentQuarter.quarter}</h2>
        <Button
          onClick={goToNextQuarter}
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </div>

      {/* Roadmap View */}
      <Card>
        <CardHeader>
          <CardTitle>{currentQuarter.quarter} Projects</CardTitle>
        </CardHeader>
        <CardContent className="content-spacing">
          {currentQuarter.projects.map(project => (
            <div key={project.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 p-4 rounded-lg border border-border hover:bg-muted/50 transition-default">
              <div className="flex items-center flex-1">
                <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-3 sm:mr-4 ${project.color} shrink-0`}></div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{project.name}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{project.startDate} - {project.endDate}</p>
                </div>
              </div>
              <Badge variant={statusVariant[project.status as Status]} className="w-fit sm:ml-4">
                {project.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
