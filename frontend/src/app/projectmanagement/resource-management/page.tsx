
'use client';

import { BarChart2, AlertTriangle } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const teamMembers = [
  {
    id: 'U1',
    name: 'Alia Bhatt',
    role: 'Frontend Developer',
    currentTasks: 3,
    capacity: 5,
    availability: 'High',
    avatar: '/avatars/01.png',
  },
  {
    id: 'U2',
    name: 'Ranbir Kapoor',
    role: 'Backend Developer',
    currentTasks: 6,
    capacity: 5,
    availability: 'Low',
    avatar: '/avatars/02.png',
  },
  {
    id: 'U3',
    name: 'Deepika Padukone',
    role: 'UI/UX Designer',
    currentTasks: 2,
    capacity: 4,
    availability: 'High',
    avatar: '/avatars/03.png',
  },
  {
    id: 'U4',
    name: 'Shah Rukh Khan',
    role: 'QA Engineer',
    currentTasks: 4,
    capacity: 4,
    availability: 'Medium',
    avatar: '/avatars/04.png',
  },
];

export default function ResourceManagementPage() {
  return (
    <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
      <PageHeader
        title="Resource Management"
        description="Monitor team workload and resource allocation."
      />

      <Card>
        <CardHeader>
          <CardTitle>Team Member Overview</CardTitle>
        </CardHeader>
        <CardContent className="content-spacing">
          {teamMembers.map(member => {
            const workloadPercentage = (member.currentTasks / member.capacity) * 100;
            const isOverloaded = member.currentTasks > member.capacity;
            return (
              <div
                key={member.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-default"
              >
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="font-semibold text-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Current Tasks</p>
                    <p className={`font-semibold ${isOverloaded ? 'text-destructive' : 'text-foreground'}`}>
                      {member.currentTasks} / {member.capacity}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Workload</p>
                    <Progress
                      value={Math.min(workloadPercentage, 100)}
                      className="h-2.5"
                      indicatorClassName={isOverloaded ? 'bg-destructive' : 'bg-primary'}
                    />
                    {isOverloaded && (
                      <p className="text-xs text-destructive flex items-center mt-1">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Overloaded
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 shrink-0"
                >
                  <BarChart2 className="h-5 w-5" />
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
