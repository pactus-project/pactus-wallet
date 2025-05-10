import React from 'react';
import MemoInput from './MemoInput';
import FormItem from './Form/FormItem';

interface FormMemoInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  placeholder?: string;
  id?: string;
  name?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  touched?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  label?: string;
  hideLabel?: boolean;
}

const FormMemoInput: React.FC<FormMemoInputProps> = ({
  value,
  onChange,
  maxLength = 64,
  placeholder = 'Enter memo (optional)',
  id = 'memo',
  name = 'memo',
  className = '',
  disabled = false,
  required = false,
  onBlur,
  label = 'Memo',
  hideLabel = false,
}) => {

  return (
    <FormItem name={name} className="flex flex-col gap-1">
      <MemoInput
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
        id={id}
        name={name}
        className={className}
        disabled={disabled}
        required={required}
        onBlur={onBlur}
        label={label}
        hideLabel={hideLabel}
      />
    </FormItem>
  );
};

export default FormMemoInput;
