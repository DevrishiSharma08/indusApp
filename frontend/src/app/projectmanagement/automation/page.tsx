
'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, MoreHorizontal, Zap } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const initialRules = [
  {
    id: 'AR-001',
    name: 'Critical Bug Assignment',
    trigger: 'When a Bug is created with Priority = Critical',
    action: 'Assign to Senior Developer',
    isActive: true,
  },
  {
    id: 'AR-002',
    name: 'Task Completion Notification',
    trigger: 'When a Task Status changes to Done',
    action: 'Notify Project Manager via Email',
    isActive: true,
  },
  {
    id: 'AR-003',
    name: 'Overdue Task Alert',
    trigger: 'When a Task Due Date is overdue',
    action: 'Send Slack notification to Assignee and Lead',
    isActive: false,
  },
];

export default function AutomationPage() {
  const [rules, setRules] = useState(initialRules);

  const toggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  return (
    <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
      <PageHeader
        title="Automation Rules"
        description="Automate your project workflows."
        primaryAction={{
          content: 'Create Rule',
          onClick: () => console.log('Create new rule'),
          icon: Plus,
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle>Defined Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {rules.map(rule => (
            <Card key={rule.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4">
              <div className="flex items-start sm:items-center mb-4 sm:mb-0">
                <div className="p-2 bg-primary/10 rounded-md mr-4">
                    <Zap className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{rule.name}</p>
                  <p className="text-sm text-muted-foreground"><b>Trigger:</b> {rule.trigger}</p>
                  <p className="text-sm text-muted-foreground"><b>Action:</b> {rule.action}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 ml-auto sm:ml-0 pl-12 sm:pl-0">
                <Switch
                  checked={rule.isActive}
                  onCheckedChange={() => toggleRule(rule.id)}
                  aria-label={`Toggle rule ${rule.name}`}
                />
                <Badge variant={rule.isActive ? 'default' : 'outline'}>
                  {rule.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem><Edit className="mr-2 h-4 w-4"/> Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4"/> Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
