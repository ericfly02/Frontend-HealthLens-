// components/ui/Loader.tsx
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      <span>Processing your image, please wait...</span>
    </div>
  );
};

export default Loader;
