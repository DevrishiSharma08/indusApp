'use client';

import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  variant: AlertVariant;
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  }[];
}

const alertVariants = {
  success: {
    container: 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
    icon: CheckCircle,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    titleColor: 'text-emerald-900 dark:text-emerald-100',
  },
  error: {
    container: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    icon: XCircle,
    iconColor: 'text-red-600 dark:text-red-400',
    titleColor: 'text-red-900 dark:text-red-100',
  },
  warning: {
    container: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
    icon: AlertTriangle,
    iconColor: 'text-amber-600 dark:text-amber-400',
    titleColor: 'text-amber-900 dark:text-amber-100',
  },
  info: {
    container: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
    icon: Info,
    iconColor: 'text-blue-600 dark:text-blue-400',
    titleColor: 'text-blue-900 dark:text-blue-100',
  },
};

export default function Alert({
  variant,
  title,
  message,
  dismissible = false,
  onDismiss,
  className,
  actions
}: AlertProps) {
  const config = alertVariants[variant];
  const IconComponent = config.icon;

  return (
    <div className={cn(
      'rounded-lg border p-4',
      config.container,
      className
    )}>
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <IconComponent className={cn('h-5 w-5 mt-0.5 flex-shrink-0', config.iconColor)} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={cn('text-sm font-semibold mb-1', config.titleColor)}>
              {title}
            </h4>
          )}
          <p className="text-sm leading-relaxed">
            {message}
          </p>

          {/* Actions */}
          {actions && actions.length > 0 && (
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={action.variant || 'default'}
                  onClick={action.onClick}
                  className={cn(
                    'w-full sm:w-auto',
                    variant === 'success' && action.variant === 'default' && 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700',
                    variant === 'error' && action.variant === 'default' && 'bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700',
                    variant === 'warning' && action.variant === 'default' && 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700',
                    variant === 'info' && action.variant === 'default' && 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700'
                  )}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Dismiss Button */}
        {dismissible && (
          <button
            onClick={onDismiss}
            className={cn(
              'p-1 rounded-md hover:bg-accent transition-colors flex-shrink-0',
              config.iconColor
            )}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}