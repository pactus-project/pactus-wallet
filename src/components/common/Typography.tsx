import React, { ReactNode, ElementType } from 'react';
import { twMerge } from 'tailwind-merge';

type TypographyVariant =
  | 'h1' // 48px desktop, 32px mobile
  | 'h2' // 20px desktop, 18px mobile
  | 'body1' // 16px desktop, 14px mobile
  | 'body2' // 15px desktop, 14px mobile
  | 'caption1' // 14px desktop, 12px mobile
  | 'caption2' // 12px desktop, 11px mobile
  | 'caption3'; // 12px desktop, 10px mobile

interface TypographyProps {
  variant: TypographyVariant;
  children: ReactNode;
  className?: string;
  as?: ElementType;
  color?: string;
}

// Responsive styles with mobile-first approach
const variantStyles: Record<TypographyVariant, string> = {
  h1: 'text-[32px] md:text-[48px] font-semibold text-white',
  h2: 'text-[18px] md:text-[20px] font-semibold text-white',
  body1: 'text-[14px] md:text-[16px] font-normal text-white',
  body2: 'text-[14px] md:text-[15px] font-normal text-white',
  caption1: 'text-[12px] md:text-[14px] font-medium text-white',
  caption2: 'text-[11px] md:text-[12px] font-normal text-white',
  caption3: 'text-[10px] md:text-[12px] font-normal text-white',
};

export const Typography = ({
  variant,
  children,
  className,
  as = 'div',
  color,
}: TypographyProps) => {
  const baseClasses = variantStyles[variant];

  // Handle different color formats:
  // 1. Full class names like "text-red-500"
  // 2. Tailwind color names like "red-500"
  // 3. Arbitrary values like "#FF0000" or "rgb(255,0,0)"
  let colorClass = '';
  if (color) {
    if (color.startsWith('text-')) {
      // Already a full Tailwind class
      colorClass = color;
    } else if (color.startsWith('#') || color.startsWith('rgb') || color.startsWith('hsl')) {
      // Arbitrary color value
      colorClass = `text-[${color}]`;
    } else {
      // Tailwind color name
      colorClass = `text-${color}`;
    }
  }

  const finalClasses = twMerge(baseClasses, colorClass, className);

  return React.createElement(as, { className: finalClasses }, children);
};

export default Typography;
