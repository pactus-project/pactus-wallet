import { PropsWithChildren } from 'react';

export default function Desktop({ children }: PropsWithChildren) {
  return <div className="hidden desktop:!block">{children}</div>;
}
