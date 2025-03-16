'use client';
import React, { useMemo, useEffect, useRef, useState, useId } from "react";

interface BorderBeamProps {
    size?: number;
    duration?: number;
    delay?: number;
    colorFrom?: string;
    colorTo?: string;
    className?: string;
    style?: React.CSSProperties;
    reverse?: boolean;
    initialOffset?: number;
    boxShadow?: {
        color: string;
        blur?: number;
        spread?: number;
    };
    parentId?: string;
    /**
     * If true, the border beam will only be visible on hover.
     */
    showOnHover?: boolean;
}

const BorderBeam: React.FC<BorderBeamProps> = ({
    size = 50,
    duration = 6,
    delay = 0,
    colorFrom = "#ffaa40",
    colorTo = "#9c40ff",
    className = "",
    style = {},
    reverse = false,
    initialOffset = 0,
    boxShadow,
    parentId,
    showOnHover = false,
}) => {
    const innerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const uniqueId = useId();

    useEffect(() => {
        if (parentId) {
            const parentElement = document.getElementById(parentId);
            if (!parentElement) return;

            // Apply initial styles immediately
            parentElement.style.setProperty('overflow', 'hidden', 'important');
            parentElement.style.setProperty('position', 'relative', 'important');
            parentElement.style.setProperty('z-index', '1', 'important');

            if (boxShadow && (isHovered && showOnHover)) {
                const updateBoxShadow = () => {
                    if (!innerRef.current) return;

                    const rect = innerRef.current.getBoundingClientRect();
                    const parentRect = parentElement.getBoundingClientRect();

                    let x = rect.left - parentRect.left;
                    let y = rect.top - parentRect.top;

                    x = Math.max(-10, Math.min(10, x));
                    y = Math.max(-10, Math.min(10, y));

                    const blur = boxShadow.blur || 20;
                    const spread = boxShadow.spread || 0;

                    parentElement.style.setProperty('box-shadow', 
                        `${x}px ${y}px ${blur}px ${spread}px ${boxShadow.color}`, 
                        'important'
                    );
                };

                // Initial update
                updateBoxShadow();
                const animationFrame = setInterval(updateBoxShadow, 16);

                return () => {
                    clearInterval(animationFrame);
                    if (parentElement) {
                        parentElement.style.removeProperty('box-shadow');
                        parentElement.style.removeProperty('overflow');
                        parentElement.style.removeProperty('position');
                        parentElement.style.removeProperty('z-index');
                    }
                };
            }
        }
    }, [boxShadow, parentId, isHovered, showOnHover]);

    useEffect(() => {
        if (!showOnHover || !parentId) return;

        const parentElement = document.getElementById(parentId);
        if (!parentElement) return;

        const handleMouseEnter = () => setIsHovered(true);
        const handleMouseLeave = () => setIsHovered(false);

        parentElement.addEventListener("mouseenter", handleMouseEnter);
        parentElement.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            parentElement.removeEventListener("mouseenter", handleMouseEnter);
            parentElement.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [showOnHover, parentId]);

    const start = reverse ? 100 - initialOffset : initialOffset;
    const end = reverse ? -initialOffset : 100 + initialOffset;

    const animationId = useMemo(
        () => `border-beam-animation-${uniqueId.replace(/:/g, '')}`,
        [uniqueId]
    );

    const keyframes = `
    @keyframes ${animationId} {
      from { offset-distance: ${start}%; }
      to { offset-distance: ${end}%; }
    }
  `;

    const containerStyle: React.CSSProperties = {
        pointerEvents: "none",
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        borderRadius: "inherit",
        border: "1px solid transparent",
        maskClip: "padding-box, border-box",
        maskComposite: "intersect",
        maskImage:
            "linear-gradient(transparent, transparent), linear-gradient(#000, #000)",
        display: showOnHover && !isHovered ? "none" : "block",
    };

    const innerStyle: React.CSSProperties = {
        position: "absolute",
        width: size,
        height: size,
        backgroundImage: `linear-gradient(to left, ${colorFrom}, ${colorTo}, transparent)`,
        offsetPath: `rect(0 auto auto 0 round ${size}px)`,
        animation: `${animationId} ${duration}s linear infinite`,
        animationDelay: `${-delay}s`,
        ...style,
    };

    return (
        <div style={containerStyle}>
            <style>{keyframes}</style>
            <div ref={innerRef} className={className} style={innerStyle} />
        </div>
    );
};

export default BorderBeam;
