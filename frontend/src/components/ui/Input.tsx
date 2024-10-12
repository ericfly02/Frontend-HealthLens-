import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${className}`}
      {...props}
    />
  );
};
