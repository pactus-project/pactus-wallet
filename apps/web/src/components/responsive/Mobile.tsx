import { PropsWithChildren } from 'react';

export default function Mobile({ children }: PropsWithChildren) {
  return <div className="tablet:hidden">{children}</div>;
}
