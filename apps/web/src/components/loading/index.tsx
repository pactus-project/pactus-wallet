'use client'
import dynamic from 'next/dynamic';
import React from 'react'
import { loadingLottie } from '@/assets';
import './style.css';

const LottiePlayer = dynamic(() => import('react-lottie-player'), { ssr: false });

interface LoadingProps {
  /**
   * Width of the loading overlay
   */
  width?: string | number;
  /**
   * Height of the loading overlay
   */
  height?: string | number;
  /**
   * Optional className to add to the overlay
   */
  className?: string;
  /**
   * Size of the animation
   */
  animationSize?: number;
  /**
   * Optional aria-label for screen readers
   */
  ariaLabel?: string;
}

const Loading = ({ 
  width, 
  height, 
  className = '', 
  animationSize = 300,
  ariaLabel = 'Loading content' 
}: LoadingProps) => {
  return (
    <div 
      className={`loading-overlay ${className}`}
      style={{
        width: width || '100%',
        height: height || '100%',
      }}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
    >
      <div className="loading-animation">
        <LottiePlayer
          animationData={loadingLottie}
          loop={true}
          play
          style={{ height: `${animationSize}px` }}
          aria-hidden="true"
        />
        <span className="visually-hidden">{ariaLabel}</span>
      </div>
    </div>
  )
}

export default Loading