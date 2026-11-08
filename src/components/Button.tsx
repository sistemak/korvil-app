import React, { forwardRef, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:outline-indigo-600",
  secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:outline-gray-500",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600",
  ghost: "bg-transparent text-indigo-600 hover:bg-indigo-50 focus-visible:outline-indigo-600",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-2.5 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      className = "",
      children,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;
    const classes = [
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      isDisabled ? "opacity-50 cursor-not-allowed" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        className={classes}
        disabled={isDisabled}
        {...rest}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          leftIcon && <span className="mr-2 flex items-center">{leftIcon}</span>
        )}
        <span>{children}</span>
        {rightIcon && <span className="ml-2 flex items-center">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";
