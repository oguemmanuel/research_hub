"use client"

import React from 'react';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'it', label: 'Italian' },
  { code: 'fr', label: 'French' }
];

const DropdownMenuBox = ({ onLanguageChange }) => {
  const handleChange = (e) => {
    onLanguageChange(e.target.value);
  };

  return (
    <select 
      onChange={handleChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
    >
      <option value="" disabled selected>Select Language</option>
      {LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
};

export default DropdownMenuBox;