'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface BulkAction {
  value: string;
  label: string;
  variant?: 'default' | 'destructive';
}

interface BulkActionsProps {
  selectedCount: number;
  totalCount: number;
  actions: BulkAction[];
  onAction: (action: string) => void;
  onClearSelection: () => void;
  className?: string;
}

export default function BulkActions({
  selectedCount,
  totalCount,
  actions,
  onAction,
  onClearSelection,
  className
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className={cn("flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg", className)}>
      <div className="flex items-center gap-2 flex-1">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <span className="text-primary">{selectedCount}</span>
          <span className="text-muted-foreground">of {totalCount} selected</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="h-7 px-2 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Select onValueChange={onAction}>
          <SelectTrigger className="h-9 w-full sm:w-[200px] bg-card">
            <SelectValue placeholder="Bulk Actions" />
          </SelectTrigger>
          <SelectContent>
            {actions.map((action) => (
              <SelectItem
                key={action.value}
                value={action.value}
                className={action.variant === 'destructive' ? 'text-destructive' : ''}
              >
                {action.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
