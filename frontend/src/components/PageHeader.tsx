'use client';

import { ArrowLeft, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface PageHeaderAction {
  label: string;
  onClick: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'destructive';
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string; // Alias for subtitle
  badge?: {
    label: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  showBackButton?: boolean;
  showMobileBackButton?: boolean; // Show back button only on mobile
  onBackClick?: () => void;
  actions?: PageHeaderAction[];
  primaryAction?: {
    label?: string;
    content?: string; // Alias for label
    onClick?: () => void;
    href?: string;
    icon?: React.ComponentType<{ className?: string }>;
  };
  className?: string;
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  description,
  badge,
  showBackButton = false,
  showMobileBackButton = true,
  onBackClick,
  actions = [],
  primaryAction,
  className,
  children
}: PageHeaderProps) {
  const router = useRouter();
  const displaySubtitle = description || subtitle;
  const actionLabel = primaryAction?.content || primaryAction?.label;

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  return (
    <div className={cn("bg-card border-b border-border", className)}>
      <div className="px-3 sm:px-4 py-4 sm:py-6">
        {/* Mobile & Desktop Header */}
        <div className="flex items-start justify-between gap-4">
          {/* Left side - Back button and title */}
          <div className="flex items-start space-x-3 min-w-0 flex-1">
            {(showBackButton || showMobileBackButton) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackClick}
                className={cn(
                  "p-2 h-auto -ml-2 mt-0.5 shrink-0",
                  showMobileBackButton && !showBackButton && "lg:hidden"
                )}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                  {title}
                </h1>
                {badge && (
                  <Badge variant={badge.variant || 'default'} className="text-xs">
                    {badge.label}
                  </Badge>
                )}
              </div>

              {displaySubtitle && (
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {displaySubtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Primary Action Button */}
            {primaryAction && (
              primaryAction.href ? (
                <Link href={primaryAction.href}>
                  <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground h-9"
                    size="sm"
                  >
                    {primaryAction.icon && <primaryAction.icon className="w-4 h-4 sm:mr-2" />}
                    <span className="hidden sm:inline">{actionLabel}</span>
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={primaryAction.onClick}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-9"
                  size="sm"
                >
                  {primaryAction.icon && <primaryAction.icon className="w-4 h-4 sm:mr-2" />}
                  <span className="hidden sm:inline">{actionLabel}</span>
                </Button>
              )
            )}

            {/* More Actions Dropdown */}
            {actions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="p-2">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {actions.map((action, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={action.onClick}
                      className={cn(
                        "flex items-center space-x-2",
                        action.variant === 'destructive' && "text-destructive focus:text-destructive"
                      )}
                    >
                      {action.icon && <action.icon className="h-4 w-4" />}
                      <span>{action.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Custom children content */}
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}