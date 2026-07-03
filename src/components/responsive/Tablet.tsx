import { PropsWithChildren } from 'react';

export default function Tablet({ children }: PropsWithChildren) {
  return <div className="hidden tablet:!block">{children}</div>;
}
