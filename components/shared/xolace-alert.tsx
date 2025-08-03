import React from 'react';
import { AlertTriangle, Shield, CheckCircle, Info, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Alert variant types
type AlertVariant = 'info' | 'warning' | 'success' | 'error' | 'security';

// Alert size types
type AlertSize = 'sm' | 'md' | 'lg';

interface AlertProps {
  variant?: AlertVariant;
  size?: AlertSize;
  title: string;
  description: string;
  supportingText?: string;
  showIcon?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const alertVariants = {
  info: {
    container: 'border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50',
    iconBg: 'bg-blue-100',
    icon: Info,
    iconColor: 'text-blue-600',
    title: 'text-blue-800',
    description: 'text-blue-700',
    supporting: 'text-blue-600',
  },
  warning: {
    container: 'border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50',
    iconBg: 'bg-amber-100',
    icon: AlertTriangle,
    iconColor: 'text-amber-600',
    title: 'text-amber-800',
    description: 'text-amber-700',
    supporting: 'text-amber-600',
  },
  success: {
    container: 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50',
    iconBg: 'bg-green-100',
    icon: CheckCircle,
    iconColor: 'text-green-600',
    title: 'text-green-800',
    description: 'text-green-700',
    supporting: 'text-green-600',
  },
  error: {
    container: 'border-red-200 bg-gradient-to-r from-red-50 to-rose-50',
    iconBg: 'bg-red-100',
    icon: AlertCircle,
    iconColor: 'text-red-600',
    title: 'text-red-800',
    description: 'text-red-700',
    supporting: 'text-red-600',
  },
  security: {
    container: 'border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50',
    iconBg: 'bg-purple-100',
    icon: Shield,
    iconColor: 'text-purple-600',
    title: 'text-purple-800',
    description: 'text-purple-700',
    supporting: 'text-purple-600',
  },
};

const alertSizes = {
  sm: {
    container: 'p-3 rounded-lg',
    iconContainer: 'h-6 w-6',
    icon: 'h-3 w-3',
    title: 'text-xs font-medium',
    description: 'text-xs',
    supporting: 'text-xs',
    supportingIcon: 'h-2.5 w-2.5',
  },
  md: {
    container: 'p-4 rounded-xl',
    iconContainer: 'h-8 w-8',
    icon: 'h-4 w-4',
    title: 'text-sm font-semibold',
    description: 'text-sm',
    supporting: 'text-xs',
    supportingIcon: 'h-3 w-3',
  },
  lg: {
    container: 'p-6 rounded-2xl',
    iconContainer: 'h-10 w-10',
    icon: 'h-5 w-5',
    title: 'text-base font-semibold',
    description: 'text-sm',
    supporting: 'text-sm',
    supportingIcon: 'h-4 w-4',
  },
};

export default function Alert({
  variant = 'info',
  size = 'md',
  title,
  description,
  supportingText,
  showIcon = true,
  dismissible = false,
  onDismiss,
  className,
  children,
}: AlertProps) {
  const variantStyles = alertVariants[variant];
  const sizeStyles = alertSizes[size];
  const IconComponent = variantStyles.icon;

  return (
    <div
      className={cn(
        'border shadow-sm',
        variantStyles.container,
        sizeStyles.container,
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        {showIcon && (
          <div className="flex-shrink-0">
            <div
              className={cn(
                'flex items-center justify-center rounded-full',
                variantStyles.iconBg,
                sizeStyles.iconContainer
              )}
            >
              <IconComponent
                className={cn(variantStyles.iconColor, sizeStyles.icon)}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={cn(variantStyles.title, sizeStyles.title, 'mb-1')}>
            {title}
          </h3>
          <p className={cn(variantStyles.description, sizeStyles.description, 'mb-3')}>
            {description}
          </p>
          
          {/* Supporting text */}
          {supportingText && (
            <div className={cn('flex items-center gap-2', sizeStyles.supporting)}>
              <CheckCircle className={cn(variantStyles.iconColor, sizeStyles.supportingIcon)} />
              <span className={variantStyles.supporting}>{supportingText}</span>
            </div>
          )}

          {/* Custom children content */}
          {children && (
            <div className="mt-3">
              {children}
            </div>
          )}
        </div>

        {/* Dismiss button */}
        {dismissible && (
          <button
            onClick={onDismiss}
            className={cn(
              'flex-shrink-0 rounded-md p-1 hover:bg-black/5 transition-colors',
              variantStyles.iconColor
            )}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Usage examples and preset components
export const SecurityAlert = (props: Omit<AlertProps, 'variant'>) => (
  <Alert variant="security" {...props} />
);

export const WarningAlert = (props: Omit<AlertProps, 'variant'>) => (
  <Alert variant="warning" {...props} />
);

export const InfoAlert = (props: Omit<AlertProps, 'variant'>) => (
  <Alert variant="info" {...props} />
);

export const SuccessAlert = (props: Omit<AlertProps, 'variant'>) => (
  <Alert variant="success" {...props} />
);

export const ErrorAlert = (props: Omit<AlertProps, 'variant'>) => (
  <Alert variant="error" {...props} />
);