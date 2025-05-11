import React from 'react';
import SelectInput from './SelectInput';
import FormItem from './Form/FormItem';
import { Rule } from 'rc-field-form/es/interface';

interface SelectOption {
  value: string;
  label: React.ReactNode;
}

interface FormSelectInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  id?: string;
  name?: string;
  className?: string;
  labelClassName?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  touched?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  label?: string;
  hideLabel?: boolean;
  rules?: Rule[];
}

const FormSelectInput: React.FC<FormSelectInputProps> = ({
  value,
  onChange,
  options,
  placeholder,
  id,
  className,
  name,
  labelClassName = '',
  disabled = false,
  required = false,
  onBlur,
  label,
  hideLabel = false,
  rules,
}) => {
  return (
    <FormItem name={name} className="flex flex-col gap-1" rules={rules}>
      <SelectInput
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        id={id}
        className={className}
        name={name}
        labelClassName={labelClassName}
        disabled={disabled}
        required={required}
        onBlur={onBlur}
        label={label}
        hideLabel={hideLabel}
      />
    </FormItem>
  );
};

export default FormSelectInput;
