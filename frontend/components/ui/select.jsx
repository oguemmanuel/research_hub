import React, { useState } from 'react';

// Main Select component
export function Select({ value, onValueChange, children }) {
  return <div>{React.Children.map(children, child => React.cloneElement(child, { value, onValueChange }))}</div>;
}

// Trigger for opening the dropdown
export function SelectTrigger({ children, className }) {
  return (
    <div className={`${className} border rounded px-4 py-2 cursor-pointer text-gray-700 hover:bg-gray-200 transition-all`}>
      {children}
    </div>
  );
}

// Dropdown content container
export function SelectContent({ children }) {
  return (
    <div className="border rounded mt-1 bg-white shadow-lg max-h-60 overflow-auto">
      {children}
    </div>
  );
}

// Dropdown item for each option
export function SelectItem({ value, children, onValueChange }) {
  return (
    <div
      onClick={() => onValueChange(value)}
      className="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer transition-colors"
    >
      {children}
    </div>
  );
}

// Displays selected value or placeholder text
export function SelectValue({ value, placeholder }) {
  return <span className="text-gray-700">{value || placeholder}</span>;
}
