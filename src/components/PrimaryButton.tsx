import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

type PrimaryButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

/**
 * PrimaryButton – botão de ação principal.
 *
 * A cor de fundo foi atualizada para `bg-primary-700` (e hover `bg-primary-800`)
 * a fim de atender ao contraste WCAG AA para texto branco.
 */
export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  onClick,
  loading = false,
  disabled = false,
  className,
}) => {
  const isInteractive = !(disabled || loading);

  return (
    <button
      type="button"
      onClick={isInteractive ? onClick : undefined}
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
        // Core colors – high contrast background with white text
        'bg-primary-700 text-white hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400',
        // Disabled state
        disabled && 'opacity-50 cursor-not-allowed',
        // Additional custom classes
        className
      )}
    >
      {loading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
      )}
      {children}
    </button>
  );
};
