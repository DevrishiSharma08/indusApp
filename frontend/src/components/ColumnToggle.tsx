'use client';

import { useState } from 'react';
import { Columns3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
}

interface ColumnToggleProps {
  columns: ColumnConfig[];
  onColumnChange: (columns: ColumnConfig[]) => void;
}

export default function ColumnToggle({ columns, onColumnChange }: ColumnToggleProps) {
  const toggleColumn = (key: string) => {
    const updated = columns.map(col =>
      col.key === key ? { ...col, visible: !col.visible } : col
    );
    onColumnChange(updated);
  };

  const showAll = () => {
    const updated = columns.map(col => ({ ...col, visible: true }));
    onColumnChange(updated);
  };

  const hideAll = () => {
    const updated = columns.map(col => ({ ...col, visible: false }));
    onColumnChange(updated);
  };

  const visibleCount = columns.filter(col => col.visible).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Columns3 className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex items-center justify-between px-2 py-1.5">
          <Button variant="ghost" size="sm" onClick={showAll} className="h-7 text-xs">
            Show All
          </Button>
          <Button variant="ghost" size="sm" onClick={hideAll} className="h-7 text-xs">
            Hide All
          </Button>
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto">
          {columns.map((column) => (
            <DropdownMenuCheckboxItem
              key={column.key}
              checked={column.visible}
              onCheckedChange={() => toggleColumn(column.key)}
            >
              {column.label}
            </DropdownMenuCheckboxItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
