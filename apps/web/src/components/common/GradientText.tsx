import React from 'react';

interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * GradientText component that applies a gradient to text
 * Uses the primary gradient colors defined in the design system
 */
const GradientText: React.FC<GradientTextProps> = ({ children, className = '', ...props }) => (
  <span
    className={`bg-gradient-primary bg-clip-text text-transparent font-medium font-primary text-xs ${className}`}
    {...props}
  >
    {children}
  </span>
);

export default GradientText;
