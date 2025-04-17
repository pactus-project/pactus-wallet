import dynamic from 'next/dynamic';
import React from 'react'
const LottiePlayer = dynamic(() => import('react-lottie-player'), { ssr: false });

interface LottieProps {
  animationData: any;
  loop?: boolean;
  className: string;
  play?: boolean;
}

const Lottie: React.FC<LottieProps> = ({ 
  animationData, 
  loop = false, 
  className,
  play = true 
}) => {
    return (
        <div className={className}>
            <LottiePlayer
                animationData={animationData}
                loop={loop}
                className={className}
                play={play}
                aria-hidden="true"
            />
        </div>
    )
}

export default Lottie