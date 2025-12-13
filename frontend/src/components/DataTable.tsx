import { ReactNode, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreVertical } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  className?: string;
  render?: (value: any, row: any) => ReactNode;
}

interface Action {
  label: string;
  icon?: ReactNode;
  onClick: (row: any) => void;
  className?: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  className?: string;
  emptyMessage?: string;
  actions?: Action[];
}

const DataTable = ({ columns, data, className = "", emptyMessage = "No data found", actions }: DataTableProps) => {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

  return (
    <div className={`rounded-md border border-border bg-card ${className}`}>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted hover:bg-muted">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={`text-xs font-medium uppercase text-muted-foreground ${column.className || ""}`}
              >
                {column.label}
              </TableHead>
            ))}
            {actions && actions.length > 0 && (
              <TableHead className="text-xs font-medium uppercase text-muted-foreground w-12">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="py-8 text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow key={index} className="hover:bg-muted/50 border-border">
                {columns.map((column) => (
                  <TableCell key={column.key} className={`text-sm text-foreground ${column.className || ""}`}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </TableCell>
                ))}
                {actions && actions.length > 0 && (
                  <TableCell className="text-sm text-foreground">
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuIndex(openMenuIndex === index ? null : index)}
                        className="p-1.5 hover:bg-accent rounded-md transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </button>
                      {/* Dropdown Menu */}
                      {openMenuIndex === index && (
                        <>
                          {/* Backdrop to close menu */}
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuIndex(null)}
                          />
                          {/* Menu */}
                          <div className="absolute right-0 mt-1 w-36 bg-card border border-border rounded-lg shadow-lg z-20">
                            {actions.map((action, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  action.onClick(row);
                                  setOpenMenuIndex(null);
                                }}
                                className={`flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent transition-colors w-full text-left ${
                                  idx === 0 ? 'rounded-t-lg' : ''
                                } ${idx === actions.length - 1 ? 'rounded-b-lg' : ''} ${action.className || ''}`}
                              >
                                {action.icon}
                                <span>{action.label}</span>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;