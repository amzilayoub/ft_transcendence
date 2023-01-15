import React from "react";

import cn from "classnames";

export interface TextInputProps {
  name: string;
  placeholder: string;
  label?: string;
  type?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  inputClassName?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  name,
  type = "text",
  onChange,
  error,
  required = false,
  inputClassName,
  ...props
}) => (
  <div className="flex flex-col">
    {label && (
      <label className="text-sm font-medium text-gray-600">{label}</label>
    )}
    <input
      className={cn(
        "px-2 py-1 text-gray-800 border-primary/40 rounded-lg border focus:border-primary mt-1 block w-full focus:outline-none hover:border-primary/80 duration-200 focus:ring-primary/80 min-w-max",
        inputClassName
      )}
      placeholder={placeholder}
      required={required}
      name={name}
      type={type}
      onChange={onChange}
      {...props}
    />
    {error && <p className="text-xs italic text-red-500">{error}</p>}
  </div>
);

export default TextInput;
