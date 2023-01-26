import React from "react";

import cn from "classnames";

export interface TextInputProps {
  name: string;
  placeholder?: string;
  defaultValue?: string | number;
  label?: string;
  type?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  inputClassName?: string;
}

export const TextInputLabel = ({
  label,

  required = false,
}: {
  label: string;
  required?: boolean;
}) => (
  <label className="text-sm font-medium text-gray-600">
    {label}
    {required && <span className="text-red-500">*</span>}
  </label>
);
const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder = "",
  defaultValue,
  name,
  type = "text",
  onChange,
  error,
  required = false,
  inputClassName,
  ...props
}) => (
  <div className="flex flex-col">
    {label && <TextInputLabel label={label} required={required} />}
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
      defaultValue={defaultValue}
      {...props}
    />
    {error && <p className="text-xs italic text-red-500">{error}</p>}
  </div>
);

export const TextArea: React.FC<
  TextInputProps & {
    maxLength?: number;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  }
> = ({
  label,
  placeholder = "",
  defaultValue,
  name,
  onChange,
  error,
  required = false,
  inputClassName,
  ...props
}) => (
  <div className="flex flex-col">
    {label && <TextInputLabel label={label} required={required} />}
    <textarea
      className={cn(
        "px-2 py-1 text-gray-800 border-primary/40 rounded-lg border focus:border-primary mt-1 block w-full focus:outline-none hover:border-primary/80 duration-200 focus:ring-primary/80 min-w-max",
        inputClassName
      )}
      placeholder={placeholder}
      required={required}
      name={name}
      onChange={onChange}
      defaultValue={defaultValue}
      {...props}
    />

    {error && <p className="text-xs italic text-red-500">{error}</p>}
  </div>
);

export default TextInput;
