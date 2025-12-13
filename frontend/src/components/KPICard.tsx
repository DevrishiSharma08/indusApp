import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconColorVar?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'compact' | 'detailed' | 'minimal';
  children?: React.ReactNode;
  className?: string;
  loading?: boolean;
}

const KPICard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "bg-primary",
  iconColorVar,
  trend,
  variant = 'default',
  children,
  className = "",
  loading = false
}: KPICardProps) => {
  const getIconStyle = () => {
    if (iconColorVar) {
      return { backgroundColor: `var(${iconColorVar})` };
    }
    return {};
  };
  if (loading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="w-8 h-8 bg-muted rounded-lg"></div>
          </div>
          <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
        </CardContent>
      </Card>
    );
  }

  const getCardContent = () => {
    if (children) {
      return children;
    }

    switch (variant) {
      case 'minimal':
        return (
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-[8px] lg:text-sm text-muted-foreground mb-0.5 lg:mb-1">{title}</p>
              <p className="text-lg lg:text-2xl font-bold text-foreground">{value}</p>
            </div>
            {Icon && (
              <div
                className={cn("w-6 h-6 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center flex-shrink-0", !iconColorVar && iconColor)}
                style={getIconStyle()}
              >
                <Icon className="w-3 h-3 lg:w-6 lg:h-6 text-white" />
              </div>
            )}
          </div>
        );

      case 'compact':
        return (
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-[9px] sm:text-xs text-muted-foreground truncate mb-0.5">{title}</p>
              <p className="text-base sm:text-xl lg:text-2xl font-bold text-foreground">{value}</p>
            </div>
            {Icon && (
              <div className={cn("w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ml-1.5", iconColor)}>
                <Icon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
              </div>
            )}
          </div>
        );

      case 'detailed':
        return (
          <>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
              {Icon && (
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", iconColor)}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
            <div className="flex items-center justify-between">
              {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
              {trend && (
                <Badge variant={trend.isPositive ? 'default' : 'destructive'} className="text-xs">
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </Badge>
              )}
            </div>
          </>
        );

      default:
        return (
          <>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
              {Icon && (
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", iconColor)}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="text-2xl font-bold text-foreground">{value}</div>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </>
        );
    }
  };

  // For minimal variant, render without Card wrapper to match dashboard styling
  if (variant === 'minimal') {
    return (
      <div className={cn("bg-card rounded-lg p-2 shadow-sm border border-border lg:p-4", className)}>
        {getCardContent()}
      </div>
    );
  }

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className={cn(
        "p-4",
        variant === 'compact' && "p-1.5 sm:p-2.5 lg:p-3"
      )}>
        {getCardContent()}
      </CardContent>
    </Card>
  );
};

export default KPICard;