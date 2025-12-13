import { LucideIcon } from 'lucide-react';

interface TabOption {
  id: string;
  label: string;
  shortLabel?: string;
  icon?: LucideIcon;
}

interface TabsProps {
  tabs: TabOption[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: 'default' | 'pills';
}

const Tabs = ({
  tabs,
  activeTab,
  onChange,
  className = "",
  variant = "default"
}: TabsProps) => {
  if (variant === "pills") {
    // Pills variant - similar to ToggleButtons but with icons
    return (
      <div className={`flex items-center space-x-1 bg-muted rounded-lg p-1 ${className}`}>
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {IconComponent && <IconComponent className="w-4 h-4" />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Default variant - horizontal tabs with border-bottom
  return (
    <div className={`border-b border-border ${className}`}>
      {/* Fade indicators for mobile scroll */}
      <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none sm:hidden"></div>
      <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none sm:hidden"></div>

      <nav
        className="flex px-4 sm:px-6 overflow-x-auto hide-scrollbar relative"
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              } whitespace-nowrap py-3 sm:py-4 px-2 sm:px-3 mr-2 sm:mr-6 border-b-2 font-medium text-xs sm:text-sm flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0 transition-colors`}
            >
              {IconComponent && <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />}
              <span className="whitespace-nowrap">
                {tab.shortLabel ? (
                  <>
                    <span className="sm:hidden">{tab.shortLabel}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </>
                ) : (
                  tab.label
                )}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Tabs;
