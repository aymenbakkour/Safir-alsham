import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  const baseStyles = 'w-full p-2 mt-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base';
  return (
    <div>
      {label && <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">{label}</label>}
      <input
        // Ensure font size is at least 16px to prevent unwanted mobile browser zooming on focus
        style={{ fontSize: '16px' }}
        className={`${baseStyles} ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;