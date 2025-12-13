
'use client';

import { Github, Gitlab, Slack, Mail } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const integrations = [
  {
    name: 'GitHub',
    description: 'Link commits and pull requests to tasks.',
    icon: Github,
    isConnected: false,
  },
  {
    name: 'GitLab',
    description: 'Link commits and merge requests to tasks.',
    icon: Gitlab,
    isConnected: true,
  },
  {
    name: 'Slack',
    description: 'Receive notifications in your Slack channels.',
    icon: Slack,
    isConnected: false,
  },
  {
    name: 'Email',
    description: 'Configure email notifications for project events.',
    icon: Mail,
    isConnected: true,
  },
];

export default function IntegrationsPage() {
  return (
    <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
      <PageHeader
        title="Integrations"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 content-spacing">
        {integrations.map((integration, index) => {
          const IconComponent = integration.icon;
          return (
            <Card key={index} className="flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-4">
                    <IconComponent className="w-8 h-8 text-muted-foreground" />
                    <CardTitle>{integration.name}</CardTitle>
                </div>
                <Badge variant={integration.isConnected ? 'default' : 'outline'}>
                  {integration.isConnected ? 'Connected' : 'Disconnected'}
                </Badge>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{integration.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant={integration.isConnected ? 'secondary' : 'default'} className="w-full">
                  {integration.isConnected ? 'Manage Settings' : 'Connect'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
