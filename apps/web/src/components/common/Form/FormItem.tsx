import React, { ReactElement, isValidElement } from 'react';
import { Rule } from 'rc-field-form/lib/interface';

import Form from './Form';
import { InternalNamePath } from 'rc-field-form/es/interface';

interface FormItemProps {
  children: ReactElement;
  required?: boolean;
  rules?: Rule[];
  name?: InternalNamePath | string;
  [key: string]: unknown;
}

function FormItem({
  children,
  rules = [],
  name,
  ...props
}: FormItemProps) {
  const _rules = [...rules];

  const cloneChild = (child: ReactElement): ReactElement =>
    React.cloneElement(child);

  return (
    <Form.Item {...props} name={name} rules={_rules}>
      {isValidElement(children) ? cloneChild(children) : null}
    </Form.Item>
  );
}

export default FormItem;
