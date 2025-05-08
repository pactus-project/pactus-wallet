'use client';
import React, { useEffect, useRef, useState, useId } from 'react';
import './styles.css';

interface BorderBeamProps {
  /**
   * Size of the beam in pixels
   */
  size?: number;
  /**
   * Animation duration in seconds
   */
  duration?: number;
  /**
   * Animation delay in seconds
   */
  delay?: number;
  /**
   * Starting color of the gradient
   */
  colorFrom?: string;
  /**
   * Ending color of the gradient
   */
  colorTo?: string;
  /**
   * Additional CSS class name
   */
  className?: string;
  /**
   * Additional inline styles
   */
  style?: React.CSSProperties;
  /**
   * Whether to reverse the animation direction
   */
  reverse?: boolean;
  /**
   * Initial position offset (0-100)
   */
  initialOffset?: number;
  /**
   * Box shadow configuration
   */
  boxShadow?: {
    color: string;
    blur?: number;
    spread?: number;
  };
  /**
   * ID of the parent element to apply effects to
   */
  parentId?: string;
  /**
   * If true, the border beam will only be visible on hover
   */
  showOnHover?: boolean;
}

const BorderBeam: React.FC<BorderBeamProps> = ({
  size = 50,
  duration = 6,
  delay = 0,
  colorFrom = '#064560',
  colorTo = '#0FEF9E',
  boxShadow = {
    color: '#0FEF9E',
    blur: 95,
    spread: -60,
  },
  className = '',
  style = {},
  reverse = false,
  initialOffset = 0,
  parentId,
  showOnHover = false,
}) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const uniqueId = useId().replace(/:/g, '');
  const animationId = `border-beam-animation-${uniqueId}`;

  // Effect for parent element styling and box shadow
  useEffect(() => {
    if (!parentId) return;

    const parentElement = document.getElementById(parentId);
    if (!parentElement) return;

    // Apply essential styles to parent
    const essentialStyles = {
      overflow: 'hidden',
      position: 'relative',
      zIndex: '1',
    };

    // Apply styles to parent element
    Object.entries(essentialStyles).forEach(([property, value]) => {
      parentElement.style.setProperty(property, value, 'important');
    });

    // Box shadow effect handling
    if (boxShadow && ((isHovered && showOnHover) || !showOnHover)) {
      const updateBoxShadow = () => {
        if (!innerRef.current) return;

        const rect = innerRef.current.getBoundingClientRect();
        const parentRect = parentElement.getBoundingClientRect();

        // Calculate position and constrain values
        const x = Math.max(-10, Math.min(10, rect.left - parentRect.left));
        const y = Math.max(-10, Math.min(10, rect.top - parentRect.top));

        const blur = boxShadow.blur || 20;
        const spread = boxShadow.spread || 0;

        parentElement.style.setProperty(
          'box-shadow',
          `${x}px ${y}px ${blur}px ${spread}px ${boxShadow.color}`,
          'important'
        );
      };

      // Initial update and setup interval
      updateBoxShadow();
      const animationFrame = setInterval(updateBoxShadow, 16);

      return () => {
        clearInterval(animationFrame);
        // Clean up styles
        ['box-shadow', 'overflow', 'position', 'z-index'].forEach(prop => {
          parentElement.style.removeProperty(prop);
        });
      };
    }
  }, [boxShadow, parentId, isHovered, showOnHover]);

  // Effect for hover detection
  useEffect(() => {
    if (!showOnHover || !parentId) return;

    const parentElement = document.getElementById(parentId);
    if (!parentElement) return;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    parentElement.addEventListener('mouseenter', handleMouseEnter);
    parentElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      parentElement.removeEventListener('mouseenter', handleMouseEnter);
      parentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [showOnHover, parentId]);

  // Calculate animation parameters
  const start = reverse ? 100 - initialOffset : initialOffset;
  const end = reverse ? -initialOffset : 100 + initialOffset;

  // Create keyframes for animation
  const keyframes = `
    @keyframes ${animationId} {
      from { offset-distance: ${start}%; }
      to { offset-distance: ${end}%; }
    }`;

  // Only render if visible
  const isVisible = showOnHover ? isHovered : true;

  return (
    <div
      className="border-beam__container"
      style={{ display: isVisible ? 'block' : 'none' }}
      aria-hidden="true"
    >
      <style>{keyframes}</style>
      <div
        ref={innerRef}
        className={`border-beam__element ${className}`}
        style={{
          width: size,
          height: size,
          backgroundImage: `linear-gradient(to left, ${colorFrom}, ${colorTo}, transparent)`,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          animation: `${animationId} ${duration}s linear infinite`,
          animationDelay: `${-delay}s`,
          ...style,
        }}
      />
    </div>
  );
};

export default BorderBeam;
