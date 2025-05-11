import React, {
  forwardRef,
  useCallback,
  useContext,
  useRef,
  ReactNode,
  CSSProperties,
  ChangeEvent,
  createContext,
} from 'react';
import {
  default as RcForm,
  Field,
  FieldContext,
  FormProvider as RcFormProvider,
  List,
  useForm,
  useWatch,
  FormInstance,
  FormProps as RcFormProps,
} from 'rc-field-form';

import cn from '@/utils/cn';

import { mergeRefs } from '@/hooks/useMergeRef';
import { InternalNamePath, Rule } from 'rc-field-form/es/interface';
import { castArray } from '@/utils/common';

const FormContext = createContext<{
  itemRef: (name: InternalNamePath | string) => (node: HTMLElement | null) => void;
}>({
  itemRef: () => () => {
    //Implement in provider
  },
});

interface FormProps extends RcFormProps {
  className?: string;
  scrollToFirstError?: boolean;
  validateTrigger?: string;
}

type FormComponentType = React.FC<FormProps> & {
  Item: typeof Item;
  List: typeof List;
  Field: typeof Field;
  FormProvider: typeof RcFormProvider;
  useForm: typeof useForm;
  useWatch: typeof useWatch;
};

export function FormCustom({
  form,
  initialValues,
  name,
  validateMessages,
  onFieldsChange,
  onFinish,
  onFinishFailed,
  onValuesChange,
  scrollToFirstError = true,
  children,
  className,
  validateTrigger = 'onSubmit',
  ...props
}: FormProps) {
  const itemsRef = useRef<Record<string, HTMLElement>>({});

  const itemRef = useCallback(
    (name: InternalNamePath | string) => (node: HTMLElement | null) => {
      const itemName = castArray(name).join('_');
      if (node) {
        itemsRef.current[itemName] = node;
      } else {
        delete itemsRef.current[itemName];
      }
    },
    []
  );

  return (
    <FormContext.Provider value={{ itemRef }}>
      <RcForm
        {...props}
        validateTrigger={validateTrigger}
        className={className}
        name={name}
        form={form}
        initialValues={initialValues}
        validateMessages={validateMessages}
        onFieldsChange={onFieldsChange}
        onFinish={onFinish}
        onFinishFailed={errorInfo => {
          if (scrollToFirstError) {
            const firstFieldName = errorInfo.errorFields[0]?.name?.join('_');
            const el = itemsRef.current[firstFieldName];
            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }

          onFinishFailed?.(errorInfo);
        }}
        onValuesChange={onValuesChange}
      >
        {children}
      </RcForm>
    </FormContext.Provider>
  );
}

interface ItemWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  classNames?: {
    root?: string;
  };
}

const ItemWrapper = forwardRef<HTMLDivElement, ItemWrapperProps>(
  ({ className, classNames = {}, children, ...props }, ref) => {
    return (
      <div {...props} ref={ref} className={cn(className, classNames.root)}>
        {children}
      </div>
    );
  }
);
ItemWrapper.displayName = 'ItemWrapper';

interface ErrorsProps {
  errors: ReactNode[];
  className?: string;
  classNames?: {
    errors?: string;
    error?: string;
  };
}

function Errors({ errors, className, classNames = {} }: ErrorsProps) {
  return (
    !!errors.length && (
      <div className={cn("flex flex-col gap-[10px] text-xs leading-4 text-error mt-3", classNames.errors, className)}>
        {errors.map((error, index) => (
          <div key={index} className={cn("tracking-[0.24px]", classNames.error)}>
            {error}
          </div>
        ))}
      </div>
    )
  );
}

interface ItemProps {
  name?: InternalNamePath | string;
  children: ReactNode;
  className?: string;
  classNames?: {
    root?: string;
    error?: string;
    errors?: string;
    tooltip?: string;
    tooltipArrow?: string;
  };
  style?: CSSProperties;
  rules?: Rule[];
}

function Item({ name = [], children, className, classNames = {}, style, ...props }: ItemProps) {
  const { itemRef } = useContext(FormContext);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Field name={name} {...props}>
      {(control, meta, form) => {
        const childElement = children as React.ReactElement<{
          onChange?: (
            e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
          ) => void;
          error: boolean;
        }>;

        const enhancedChild = !childElement
          ? null
          : React.cloneElement(childElement, {
              ...control,
              onChange: (e: ChangeEvent<HTMLInputElement>) => {
                form.setFields([{ name, errors: [] }]);
                control.onChange(e);
                childElement?.props?.onChange?.(e);
              },
              error: !!meta.errors.length,
            });

        return (
          <ItemWrapper
            ref={mergeRefs(itemRef(name), ref)}
            className={className}
            classNames={classNames}
            style={style}
          >
            {enhancedChild}
            <Errors errors={meta.errors} classNames={classNames} />
          </ItemWrapper>
        );
      }}
    </Field>
  );
}

export const useFormInstance = (): FormInstance => {
  return useContext(FieldContext);
};

const Form = Object.assign(FormCustom, {
  Item,
  List,
  Field,
  FormProvider: RcFormProvider,
  useForm,
  useWatch,
} as FormComponentType);

export default Form;
