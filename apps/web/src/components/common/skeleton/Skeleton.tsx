/* eslint-disable @typescript-eslint/naming-convention */
import cn from '@/utils/cn';
import { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import './index.css';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  visible?: boolean;
  height?: string | number;
  width?: string | number;
  circle?: boolean;
  animate?: boolean;
  radius?: string | number;
  className?: string;
  style?: CSSProperties;
}

function Skeleton({
  children,
  visible = true,
  height,
  width,
  circle = false,
  animate = true,
  radius = "8px",
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      {...props}
      style={
        {
          ...style,
          '--skeleton-height': height,
          '--skeleton-width': circle ? height : width,
          '--skeleton-radius': circle ? '999px' : radius,
        } as CSSProperties
      }
      data-visible={visible}
      data-animate={animate}
      className={cn('skeleton', className)}
    >
      {children}
    </div>
  );
}

export default Skeleton;
