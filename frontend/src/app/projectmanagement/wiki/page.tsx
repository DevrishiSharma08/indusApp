
'use client';

import { useState } from 'react';
import { Plus, FileText, Folder, Edit, Trash2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const wikiItems = [
  {
    id: 'DOC-001',
    type: 'document',
    title: 'Project Vision and Scope',
    lastEdited: '2023-10-01',
    author: 'Alia Bhatt',
  },
  {
    id: 'DOC-002',
    type: 'document',
    title: 'Meeting Notes - 2023-09-28',
    lastEdited: '2023-09-28',
    author: 'Ranbir Kapoor',
  },
  {
    id: 'FOLDER-001',
    type: 'folder',
    title: 'Technical Specifications',
    items: [
      {
        id: 'DOC-003',
        type: 'document',
        title: 'Backend API Design',
        lastEdited: '2023-10-05',
        author: 'Deepika Padukone',
      },
      {
        id: 'DOC-004',
        type: 'document',
        title: 'Frontend Architecture',
        lastEdited: '2023-10-07',
        author: 'Shah Rukh Khan',
      },
    ],
  },
];

export default function WikiPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = wikiItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
      <PageHeader
        title="Wiki / Knowledge Base"
        description="Centralized documentation and knowledge sharing."
        primaryAction={{
          content: 'Create New',
          onClick: () => console.log('Create new document'),
          icon: Plus,
        }}
      />

      <SearchBar
        placeholder="Search wiki..."
        value={searchTerm}
        onChange={setSearchTerm}
      />

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 border border-border rounded-lg hover:bg-muted/50 transition-default"
              >
                <div className="flex items-center min-w-0 flex-1">
                  {item.type === 'document' ? (
                    <FileText className="w-5 h-5 text-primary mr-3 shrink-0" />
                  ) : (
                    <Folder className="w-5 h-5 text-accent mr-3 shrink-0" />
                  )}
                  <span className="font-medium text-foreground truncate">{item.title}</span>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                  {item.type === 'document' && (
                    <span className="text-xs sm:text-sm text-muted-foreground truncate">
                      Last edited: {item.lastEdited} by {item.author}
                    </span>
                  )}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:text-primary"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
