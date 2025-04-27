"use client"

import React from 'react';

const DEPARTMENTS = [
  "Computer Science",
  
];

const Department = ({ onDepartmentChange }) => {
  return (
    <div className="mb-4">
      <label htmlFor="department" className="block text-sm font-medium mb-2">
        Department
      </label>
      <select
        id="department"
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
        onChange={(e) => onDepartmentChange(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>Select Department</option>
        {DEPARTMENTS.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Department;