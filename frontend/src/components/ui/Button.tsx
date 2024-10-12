import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'icon';
  className?: string;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  variant = 'default',
  size = 'default',
  className,
  children,
  type = 'button'
}) => {
  const baseClasses = "rounded-lg px-4 py-2 transition-all";
  const variantClasses = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700",
    outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50",
    ghost: "bg-transparent text-indigo-600 hover:bg-indigo-50"
  };
  const sizeClasses = {
    default: "text-base",
    icon: "p-2"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      type={type}
    >
      {children}
    </button>
  );
};
