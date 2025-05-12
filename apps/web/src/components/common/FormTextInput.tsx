import React from 'react';
import TextInput from './TextInput';
import FormItem from './Form/FormItem';
import { Rule } from 'rc-field-form/es/interface';

interface FormTextInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  id?: string;
  name?: string;
  className?: string;
  labelClassName?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  touched?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  label?: string;
  hideLabel?: boolean;
  rightElement?: React.ReactNode;
  autoComplete?: string;
  showLogo?: boolean;
  rules?: Rule[];
}

const FormTextInput: React.FC<FormTextInputProps> = ({
  value,
  onChange,
  type = 'text',
  placeholder = '',
  id,
  name,
  className = '',
  labelClassName = '',
  disabled = false,
  required = false,
  onBlur,
  label,
  hideLabel = false,
  rightElement,
  autoComplete,
  showLogo = false,
  rules,
}) => {

  return (
    <FormItem name={name} className="flex flex-col gap-1" rules={rules}>
      <TextInput
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        id={id}
        name={name}
        className={className}
        labelClassName={labelClassName}
        disabled={disabled}
        required={required}
        onBlur={onBlur}
        label={label}
        hideLabel={hideLabel}
        rightElement={rightElement}
        autoComplete={autoComplete}
        showLogo={showLogo}
      />
    </FormItem>
  );
};

export default FormTextInput;
