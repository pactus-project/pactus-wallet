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

type GradientType =
  | 'primary' // Blue to purple
  | 'success' // Green to teal
  | 'warning' // Yellow to orange
  | 'danger' // Red to pink
  | 'custom'; // Custom gradient (requires customGradient prop)

interface TypographyProps {
  variant: TypographyVariant;
  children: ReactNode;
  className?: string;
  as?: ElementType;
  color?: string;
  gradient?: GradientType;
  customGradient?: string; // For custom gradients (e.g., "from-red-500 to-blue-500")
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

const gradientStyles: Record<GradientType, string> = {
  primary: 'bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent',
  success: 'bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent',
  warning: 'bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent',
  danger: 'bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent',
  custom: 'bg-gradient-to-r bg-clip-text text-transparent', // Will be combined with customGradient
};

export const Typography = ({
  variant,
  children,
  className,
  as = 'div',
  color,
  gradient,
  customGradient,
}: TypographyProps) => {
  const baseClasses = variantStyles[variant];
  const colorClass = color ? `text-[${color}]` : '';
  const gradientClass = gradient ? gradientStyles[gradient] : '';
  const customGradientClass = gradient === 'custom' && customGradient ? customGradient : '';

  // If gradient is specified, it takes precedence over color
  const finalClasses = twMerge(
    baseClasses,
    gradient ? gradientClass : colorClass,
    customGradientClass,
    className
  );

  return React.createElement(as, { className: finalClasses }, children);
};

export default Typography;
