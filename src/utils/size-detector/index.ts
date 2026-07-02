"use client";

import { useEffect, useState, useRef } from "react";

type SizeType = "mobile" | "tablet" | "desktop" | "largeDesktop";

const breakpoints = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  largeDesktop: 1440,
};

const getSizeType = (width: number): SizeType => {
  if (width <= breakpoints.mobile) return "mobile";
  if (width <= breakpoints.tablet) return "tablet";
  if (width <= breakpoints.desktop) return "desktop";
  return "largeDesktop";
};

const useSizeDetector = () => {
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : breakpoints.desktop
  );
  const [size, setSize] = useState<SizeType>(
    typeof window !== "undefined" ? getSizeType(window.innerWidth) : "desktop"
  );
  const rafId = useRef<number>(0);

  useEffect(() => {
    const handleResize = () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        setWidth(window.innerWidth);
        setSize(getSizeType(window.innerWidth));
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return {
    isMobile: size === "mobile",
    isTablet: size === "tablet",
    isDesktop: size === "desktop",
    isLargeDesktop: size === "largeDesktop",
    size,
    width,
  };
};

export default useSizeDetector;
