
'use client';

import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const backlogItems = [
  { id: 'STORY-001', type: 'Story', title: 'User sign up with email', storyPoints: 8 },
  { id: 'STORY-002', type: 'Story', title: 'User log in with credentials', storyPoints: 5 },
  { id: 'BUG-001', type: 'Bug', title: 'Password reset link not working', storyPoints: 3 },
  { id: 'STORY-003', type: 'Story', title: 'Project summary on dashboard', storyPoints: 13 },
  { id: 'TASK-001', type: 'Task', title: 'Design summary card component', storyPoints: 5 },
];

type ItemType = 'Story' | 'Task' | 'Bug';

const typeVariant: { [key in ItemType]: 'secondary' | 'outline' | 'destructive' } = {
  Story: 'secondary',
  Task: 'outline',
  Bug: 'destructive',
};

export default function SprintPlanningPage() {
  const [sprintItems, setSprintItems] = useState<any[]>([]);
  const [sprintName, setSprintName] = useState('Sprint 5');
  const [sprintGoal, setSprintGoal] = useState('');

  const totalStoryPoints = sprintItems.reduce((total, item) => total + item.storyPoints, 0);

  const addToSprint = (item: any) => {
    setSprintItems(prev => [...prev, item]);
  };

  const removeFromSprint = (itemId: string) => {
    setSprintItems(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <div className="pt-20 sm:pt-20 lg:pt-20 pb-20 lg:pb-6 px-4 lg:px-6 space-y-4 lg:space-y-6">
      <PageHeader
        title="Sprint Planning"
        description="Plan and organize your upcoming sprint"
        primaryAction={{
          content: 'Start Sprint',
          onClick: () => console.log('Start sprint'),
          icon: Plus,
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backlog Section */}
        <Card>
          <CardHeader>
            <CardTitle>Backlog</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {backlogItems.map(item => (
              <div key={item.id} className="flex items-center p-3 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                <GripVertical className="w-5 h-5 text-muted-foreground mr-2 flex-shrink-0" />
                <Badge variant={typeVariant[item.type as ItemType]} className="mr-3">{item.type}</Badge>
                <span className="font-medium flex-1 text-sm">{item.title}</span>
                <span className="text-sm font-bold text-muted-foreground mr-3">{item.storyPoints} SP</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => addToSprint(item)}
                  className="h-8 w-8"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Sprint Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <Input
                type="text"
                value={sprintName}
                onChange={e => setSprintName(e.target.value)}
                className="text-xl font-bold border-0 border-b-2 border-transparent focus-visible:border-primary rounded-none px-0 focus-visible:ring-0"
              />
              <div className="text-right ml-4">
                <p className="font-bold text-xl text-primary">{totalStoryPoints} SP</p>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="sprint-goal">Sprint Goal</Label>
              <Input
                id="sprint-goal"
                type="text"
                value={sprintGoal}
                onChange={e => setSprintGoal(e.target.value)}
                placeholder="e.g., Complete user authentication"
                className="mt-2"
              />
            </div>

            <div className="space-y-3 min-h-[300px]">
              {sprintItems.map(item => (
                <div key={item.id} className="flex items-center p-3 border border-primary/20 rounded-lg bg-primary/5">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromSprint(item.id)}
                    className="mr-2 h-8 w-8"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <GripVertical className="w-5 h-5 text-muted-foreground mr-2 flex-shrink-0" />
                  <Badge variant={typeVariant[item.type as ItemType]} className="mr-3">{item.type}</Badge>
                  <span className="font-medium flex-1 text-sm">{item.title}</span>
                  <span className="text-sm font-bold">{item.storyPoints} SP</span>
                </div>
              ))}
              {sprintItems.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed border-border rounded-lg">
                  <p className="text-muted-foreground">Drag items from the backlog to plan your sprint</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}