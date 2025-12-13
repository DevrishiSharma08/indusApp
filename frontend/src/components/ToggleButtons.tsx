import { Button } from '@/components/ui/button';

interface ToggleOption {
  value: string;
  label: string;
}

interface ToggleButtonsProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const ToggleButtons = ({ options, value, onChange, className = "" }: ToggleButtonsProps) => {
  return (
    <div className={`flex items-center space-x-1 bg-muted rounded-lg p-1 ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            value === option.value
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default ToggleButtons;