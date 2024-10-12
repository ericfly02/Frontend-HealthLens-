import React from 'react';

interface DropdownMenuTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ asChild, children }) => (
  <div className={asChild ? "cursor-pointer" : ""}>
    {children}
  </div>
);

interface DropdownMenuContentProps {
  align?: 'start' | 'end';
  children: React.ReactNode;
}

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({ align = 'start', children }) => (
  <div className={`absolute ${align === 'end' ? 'right-0' : 'left-0'} bg-white shadow-lg rounded-lg`}>
    {children}
  </div>
);

interface DropdownMenuItemProps {
  onClick?: () => void;
  onSelect?: () => void;
  children: React.ReactNode;
}

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ onClick, onSelect, children }) => (
  <div 
    onClick={(e) => {
      if (onClick) onClick();
      if (onSelect) {
        e.preventDefault();
        onSelect();
      }
    }} 
    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
  >
    {children}
  </div>
);

interface DropdownMenuProps {
  children: React.ReactNode;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => (
  <div className="relative inline-block text-left">
    {children}
  </div>
);