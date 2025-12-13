'use client';

import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export type BannerVariant = 'success' | 'error' | 'warning' | 'info';

interface BannerAlertProps {
  variant: BannerVariant;
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  sticky?: boolean;
}

const bannerVariants = {
  success: {
    container: 'bg-emerald-600 dark:bg-emerald-700 text-white dark:text-emerald-50',
    icon: CheckCircle,
    iconColor: 'text-emerald-100 dark:text-emerald-200',
    buttonClass: 'bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-800 dark:hover:bg-emerald-900 text-white',
  },
  error: {
    container: 'bg-red-600 dark:bg-red-700 text-white dark:text-red-50',
    icon: XCircle,
    iconColor: 'text-red-100 dark:text-red-200',
    buttonClass: 'bg-red-700 hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-900 text-white',
  },
  warning: {
    container: 'bg-amber-600 dark:bg-amber-700 text-white dark:text-amber-50',
    icon: AlertTriangle,
    iconColor: 'text-amber-100 dark:text-amber-200',
    buttonClass: 'bg-amber-700 hover:bg-amber-800 dark:bg-amber-800 dark:hover:bg-amber-900 text-white',
  },
  info: {
    container: 'bg-blue-600 dark:bg-blue-700 text-white dark:text-blue-50',
    icon: Info,
    iconColor: 'text-blue-100 dark:text-blue-200',
    buttonClass: 'bg-blue-700 hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-900 text-white',
  },
};

export default function BannerAlert({
  variant,
  title,
  message,
  dismissible = true,
  onDismiss,
  className,
  action,
  sticky = false,
}: BannerAlertProps) {
  const config = bannerVariants[variant];
  const IconComponent = config.icon;

  return (
    <div className={cn(
      'w-full py-3 px-4',
      sticky ? 'sticky top-0 z-40' : '',
      config.container,
      className
    )}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <IconComponent className={cn('h-5 w-5 flex-shrink-0', config.iconColor)} />

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              {title && (
                <span className="font-semibold text-sm">
                  {title}
                </span>
              )}
              <span className="text-sm opacity-90">
                {message}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          {action && (
            <Button
              size="sm"
              onClick={action.onClick}
              className={cn('text-xs h-8', config.buttonClass)}
            >
              {action.label}
            </Button>
          )}

          {dismissible && (
            <button
              onClick={onDismiss}
              className="p-1 rounded-md hover:bg-white/10 transition-colors flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}