import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
}

const Select: React.FC<SelectProps> = ({ options, label, className = '', ...props }) => {
  const baseStyles = 'w-full p-2 mt-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base';
  return (
    <div>
      {label && <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">{label}</label>}
      <select
        // Ensure font size is at least 16px to prevent unwanted mobile browser zooming on focus
        style={{ fontSize: '16px' }}
        className={`${baseStyles} ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;