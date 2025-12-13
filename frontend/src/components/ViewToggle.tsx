'use client';

import { List, LayoutGrid, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ViewMode = 'table' | 'grid' | 'card';

interface ViewToggleProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  modes?: ViewMode[]; // Which modes to show (default: all three)
  className?: string;
}

export default function ViewToggle({
  view,
  onViewChange,
  modes = ['table', 'grid', 'card'],
  className
}: ViewToggleProps) {
  const viewConfigs: Record<ViewMode, { icon: typeof Table; label: string }> = {
    table: { icon: Table, label: 'Table' },
    grid: { icon: LayoutGrid, label: 'Grid' },
    card: { icon: List, label: 'Cards' }
  };

  return (
    <div className={cn("inline-flex items-center gap-1 border border-border rounded-lg p-1 bg-card", className)}>
      {modes.map((mode) => {
        const config = viewConfigs[mode];
        const Icon = config.icon;
        return (
          <Button
            key={mode}
            variant={view === mode ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange(mode)}
            className={cn(
              "h-7 px-2",
              view === mode ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground hover:text-foreground"
            )}
            title={config.label}
          >
            <Icon className="w-4 h-4" />
            <span className="ml-1.5 hidden sm:inline text-xs">{config.label}</span>
          </Button>
        );
      })}
    </div>
  );
}