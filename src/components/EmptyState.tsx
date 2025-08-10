import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({ 
  icon = '🎯',
  title,
  subtitle,
  action,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="text-6xl mb-4 opacity-60">{icon}</div>
      <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      {subtitle && (
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {subtitle}
        </p>
      )}
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
}