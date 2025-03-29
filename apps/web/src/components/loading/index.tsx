'use client'
import dynamic from 'next/dynamic';
import React from 'react'
import { loadingLottie } from '@/assets';

const LottiePlayer = dynamic(() => import('react-lottie-player'), { ssr: false });

interface LoadingProps {
  width?: string | number;
  height?: string | number;
}

const Loading = ({ width, height }: LoadingProps) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: width || '100%',
            height: height || '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            backgroundColor: '#15191C'
        }}>
            <LottiePlayer
                animationData={loadingLottie}
                loop={true}
                play
                style={{ height: '300px' }}
            />
        </div>
    )
}

export default Loading