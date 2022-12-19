import React from "react";

export interface TextInputProps {
  label: string;
  placeholder: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  name,
  onChange,
  error,
  required = false,
  ...props
}) => (
  <div className="flex flex-col">
    {label && (
      <label className="text-sm font-medium text-gray-600">{label}</label>
    )}
    <input
      className="px-2 py-1 text-gray-800 border-primary/40 rounded-lg border focus:border-primary mt-1 block w-full focus:outline-none hover:border-primary/80 duration-200 focus:ring-primary/80 min-w-max"
      placeholder={placeholder}
      required={required}
      name={name}
      onChange={onChange}
      {...props}
    />
    {error && <p className="text-red-500 text-xs italic">{error}</p>}
  </div>
);

export default TextInput;
