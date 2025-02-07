import React from 'react';

export function Input({ className, ...props }) {
  const styles = `border rounded px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 ${className}`;
  return <input className={styles} {...props} />;
}
