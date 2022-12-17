import React, { ReactNode } from "react";

import cn from "classnames";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  type?: "submit" | "button";
  size?: "small" | "normal" | "large";
  pill?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  isCompleted?: boolean;
  className?: string;
}

const styles = {
  base: "max-h-12 focus:outline-none (focus:ring-2) flex items-center justify-center rounded-lg transition ease-in-out duration-150 max-w-max",
  size: {
    small: "px-2 py-1 text-sm",
    normal: "px-4 py-2 text-normal",
    large: "px-8 py-4 text-lg",
  },
  variant: {
    primary: "bg-primary hover:bg-primary focus:ring-primary-500 text-white",
    secondary:
      "bg-secondary/95 hover:bg-secondary/80 ring-secondary focus:ring-secondary/50 text-white",
    danger:
      "bg-red-500 hover:bg-red-700 focus:ring-red-500 focus:ring-opacity-50 text-white",
  },
  pill: "rounded-full",
  disabled: "opacity-50 cursor-not-allowed",
  loading: "hover:opacity-50 cursor-not-allowed",
  completed: "opacity-50 cursor-complete",
};

const Button: React.FC<ButtonProps> = ({
  children,
  type = "button",
  variant = "primary",
  size = "normal",
  disabled = false,
  isLoading = false,
  isCompleted = false,
  pill,
  className,
  ...props
}) => (
  <button
    className={cn(
      styles.base,
      styles.size[size],
      styles.variant[variant],
      pill && styles.pill,
      disabled && styles.disabled,
      isLoading && styles.loading,
      isCompleted && styles.completed,
      className
    )}
    disabled={disabled}
    type={type}
    {...props}
  >
    {isLoading && (
      <svg
        className="animate-spin mr-3 text-white h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    )}
    {children}
  </button>
);

export default Button;
