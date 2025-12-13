
'use client';

import { useState } from 'react';
import {
  Plus,
  ChevronRight,
  GripVertical,
  Flame,
  CheckCircle2,
  Minus,
  Circle,
  Bug,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import FilterExportBar from '@/components/FilterExportBar';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const backlogItems = [
  {
    id: 'EPIC-001',
    type: 'Epic',
    title: 'User Authentication & Authorization',
    priority: 'High',
    storyPoints: null,
    icon: Flame,
    children: [
      {
        id: 'STORY-001',
        type: 'Story',
        title: 'As a user, I want to be able to sign up with my email and password',
        priority: 'High',
        storyPoints: 8,
        icon: CheckCircle2,
      },
      {
        id: 'STORY-002',
        type: 'Story',
        title: 'As a user, I want to be able to log in with my credentials',
        priority: 'High',
        storyPoints: 5,
        icon: CheckCircle2,
      },
      {
        id: 'BUG-001',
        type: 'Bug',
        title: 'Password reset link is not working',
        priority: 'Critical',
        storyPoints: 3,
        icon: Bug,
      },
    ],
  },
  {
    id: 'EPIC-002',
    type: 'Epic',
    title: 'Project Dashboard Development',
    priority: 'Medium',
    storyPoints: null,
    icon: Flame,
    children: [
      {
        id: 'STORY-003',
        type: 'Story',
        title: 'As a project manager, I want to see a summary of all active projects',
        priority: 'Medium',
        storyPoints: 13,
        icon: CheckCircle2,
      },
      {
        id: 'TASK-001',
        type: 'Task',
        title: 'Design the project summary card component',
        priority: 'Low',
        storyPoints: 5,
        icon: Circle,
      },
    ],
  },
];

type IssueType = 'Epic' | 'Story' | 'Task' | 'Bug';
type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

type Issue = {
    id: string;
    type: IssueType;
    title: string;
    priority: Priority;
    storyPoints: number | null;
    icon: React.ElementType;
    children?: Issue[];
};

const typeVariant: { [key in IssueType]: 'default' | 'secondary' | 'destructive' | 'outline'} = {
    Epic: 'default',
    Story: 'secondary',
    Task: 'outline',
    Bug: 'destructive',
};

const priorityVariant: { [key in Priority]: 'destructive' | 'secondary' | 'outline' } = {
    Critical: 'destructive',
    High: 'destructive',
    Medium: 'secondary',
    Low: 'outline',
};

function BacklogChildItem({ item }: { item: Issue }) {
    const Icon = item.icon || Circle;
    return (
        <div className="flex items-center p-3 bg-background rounded-lg mb-2 border">
            <GripVertical className="w-5 h-5 text-muted-foreground mr-2 flex-shrink-0" />
            <Icon className="w-4 h-4 text-muted-foreground mr-3 flex-shrink-0" />
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <span className="font-medium text-sm mb-2 sm:mb-0 sm:mr-4">{item.title}</span>
                <div className="flex items-center space-x-4">
                    <Badge variant={typeVariant[item.type]} className="w-16 justify-center">{item.type}</Badge>
                    <Badge variant={priorityVariant[item.priority]} className="w-20 justify-center">{item.priority}</Badge>
                    {item.storyPoints && <span className="ml-4 text-sm font-bold text-foreground w-12 text-right">{item.storyPoints} SP</span>}
                </div>
            </div>
        </div>
    );
}

export default function BacklogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<{ [key: string]: string }>({ status: 'all', priority: 'all' });

  const handleFilterChange = (key: string) => (value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filterDefinitions = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'all', label: 'All' },
        { value: 'todo', label: 'To Do' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'done', label: 'Done' },
      ],
    },
    {
      key: 'priority',
      label: 'Priority',
      options: [
        { value: 'all', label: 'All' },
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
      ],
    },
  ];

  const transformedFilters = filterDefinitions.map(def => ({
    ...def,
    value: filters[def.key],
    onChange: handleFilterChange(def.key),
  }));

  return (
    <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
      <PageHeader
        title="Backlog"
        primaryAction={{
          content: 'Create Issue',
          onClick: () => console.log('Create new issue'),
          icon: Plus,
        }}
      />

      <SearchBar placeholder="Search backlog..." value={searchTerm} onChange={setSearchTerm} />
      <FilterExportBar filters={transformedFilters} />

      <Card className="mt-6">
        <CardContent className="p-2 md:p-4">
            <Accordion type="multiple" defaultValue={['EPIC-001']} className="w-full">
                {backlogItems.map(item => {
                    const TypedIcon = item.icon;
                    return (
                        <AccordionItem value={item.id} key={item.id}>
                            <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-lg">
                                <div className="flex items-center flex-1">
                                    <GripVertical className="w-5 h-5 text-muted-foreground mr-2 flex-shrink-0" />
                                    <TypedIcon className="w-5 h-5 text-primary mr-4 flex-shrink-0" />
                                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between text-left">
                                        <span className="font-semibold text-base sm:mr-4">{item.title}</span>
                                        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                                            <Badge variant={typeVariant[item.type as IssueType]} className="w-16 justify-center">{item.type}</Badge>
                                            <Badge variant={priorityVariant[item.priority as Priority]} className="w-20 justify-center">{item.priority}</Badge>
                                        </div>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 pl-8 pr-2 space-y-2">
                                {item.children?.map(child => (
                                    <BacklogChildItem key={child.id} item={child as Issue} />
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
