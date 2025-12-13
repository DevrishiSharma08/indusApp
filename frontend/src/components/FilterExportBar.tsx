'use client';

import { useState } from 'react';
import { Filter, Download, X, FileText, Table, File, LayoutGrid, Columns, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface FilterOption {
  key: string;
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

interface FilterExportBarProps {
  filters: FilterOption[];
  onExport?: (format: 'excel' | 'csv' | 'pdf') => void;
  showExport?: boolean;
  showViewToggle?: boolean;
  viewToggleProps?: {
    currentView: 'card' | 'table';
    onViewChange: (view: 'card' | 'table') => void;
  };
  showSearch?: boolean;
  searchProps?: {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
  };
  className?: string;
}

export default function FilterExportBar({
  filters,
  onExport,
  showExport = true,
  showViewToggle = false,
  viewToggleProps,
  showSearch = false,
  searchProps,
  className = '',
}: FilterExportBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Count active filters
  const activeFilterCount = filters.filter(
    (filter) => filter.value !== 'all' && filter.value !== ''
  ).length;

  const exportFormats = [
    { key: 'excel', label: 'Excel (.xlsx)', icon: Table },
    { key: 'csv', label: 'CSV (.csv)', icon: FileText },
    { key: 'pdf', label: 'PDF (.pdf)', icon: File },
  ];

  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    setIsExportOpen(false);
    if (onExport) {
      onExport(format);
    }
  };

  const resetFilters = () => {
    filters.forEach((filter) => {
      filter.onChange('all');
    });
  };

  return (
    <div className={className}>
      {/* Single flex row: View Toggle → Search → Filter → Export */}
      <div className="flex items-center gap-2">
        {/* View Toggle - First (Only 2 views: card and table) */}
        {showViewToggle && viewToggleProps && (
          <div className="inline-flex gap-1 flex-shrink-0">
            <button
              onClick={() => viewToggleProps.onViewChange('card')}
              className={`flex items-center justify-center h-9 w-9 rounded-md transition-colors ${viewToggleProps.currentView === 'card'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => viewToggleProps.onViewChange('table')}
              className={`flex items-center justify-center h-9 w-9 rounded-md transition-colors ${viewToggleProps.currentView === 'table'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              title="Table View"
            >
              <Columns className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search Bar - Second */}
        {showSearch && searchProps && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={searchProps.placeholder || "Search..."}
              value={searchProps.value}
              onChange={(e) => searchProps.onChange(e.target.value)}
              className="pl-10 h-9 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
            />
          </div>
        )}

        {/* Filter Button - Third (Icon only) */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center justify-center h-9 w-9 rounded-md transition-colors ${activeFilterCount > 0
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            title={`Filter ${activeFilterCount > 0 ? `(${activeFilterCount} active)` : ''}`}
          >
            <Filter className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Filter Dropdown */}
          {isFilterOpen && (
            <div
              className="
      fixed inset-0 z-50
      bg-black/10 sm:bg-transparent
      flex justify-center items-center sm:items-start sm:pt-0
      p-4 sm:p-0
    "
              onClick={() => setIsFilterOpen(false)} // closes when clicking outside
            >
              <div
                className="
        bg-card border border-border rounded-lg shadow-lg
        w-full max-w-sm sm:max-w-[320px]
        sm:absolute sm:top-[50px] sm:right-[20px]
        max-h-[90vh] overflow-y-auto
      "
                onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-foreground">Filter Options</h3>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="p-1 hover:bg-accent rounded-md"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {filters.map((filter) => (
                      <div key={filter.key}>
                        <label className="block text-xs font-medium text-foreground mb-2">
                          {filter.label}
                        </label>
                        <select
                          value={filter.value}
                          onChange={(e) => filter.onChange(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                        >
                          {filter.options.map((option) => (
                            <option key={option.value} value={option.value} className="bg-background text-foreground">
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}

                    {activeFilterCount > 0 && (
                      <div className="pt-2 border-t border-border">
                        <button
                          onClick={resetFilters}
                          className="text-sm text-primary hover:text-primary/80 font-medium"
                        >
                          Reset All Filters
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Export Button - Fourth (Last, Icon only) */}
        {showExport && (
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="flex items-center justify-center h-9 w-9 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-accent"
              title="Export"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Export Dropdown */}
            {isExportOpen && (
              <div className="absolute top-full right-0 mt-2 w-40 sm:w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                <div className="py-2">
                  <div className="px-3 sm:px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Export Format
                  </div>
                  {exportFormats.map((format) => {
                    const IconComponent = format.icon;
                    return (
                      <button
                        key={format.key}
                        onClick={() => handleExport(format.key as 'excel' | 'csv' | 'pdf')}
                        className="flex items-center space-x-2 sm:space-x-3 w-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-foreground hover:bg-accent transition-colors"
                      >
                        <IconComponent className="w-4 h-4 text-muted-foreground" />
                        <span>{format.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active Filter Tags - Show on larger screens */}
      {activeFilterCount > 0 && (
        <div className="hidden lg:flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
          {filters
            .filter((filter) => filter.value !== 'all' && filter.value !== '')
            .map((filter) => (
              <span
                key={filter.key}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary"
              >
                {filter.label}: {filter.options.find((opt) => opt.value === filter.value)?.label}
                <button
                  onClick={() => filter.onChange('all')}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-primary/20"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
        </div>
      )}

      {/* Overlay to close dropdowns */}
      {(isFilterOpen || isExportOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsFilterOpen(false);
            setIsExportOpen(false);
          }}
        />
      )}
    </div>
  );
}
