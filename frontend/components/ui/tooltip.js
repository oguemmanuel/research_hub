// components/ui/tooltip.js
import React from 'react';

export const Tooltip = ({ children, content, position = 'top', className = '' }) => {
  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  };

  return (
    <div className="relative group inline-block">
      {children}
      <span
        className={`absolute ${positionClasses[position]} hidden group-hover:block p-2 bg-black text-white text-sm rounded ${className}`}
        aria-hidden="true"
      >
        {content}
      </span>
    </div>
  );
};
