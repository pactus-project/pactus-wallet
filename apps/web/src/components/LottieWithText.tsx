import React from 'react';
import Lottie from 'react-lottie-player';
import Typography from './common/Typography';

interface LottieWithTextProps {
  animationData: object | { default: object };
  title?: string;
  description: string;
}

export const LottieWithText: React.FC<LottieWithTextProps> = ({
  animationData,
  title,
  description,
}) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="flex flex-col items-center justify-center w-[248px] h-[248px]">
          <Lottie
            animationData={animationData}
            loop={true}
            play
            aria-hidden="true"
            className="w-full h-full"
          />
        </div>
        <Typography variant="h1" className="text-center">
          {title}
        </Typography>
        <Typography variant="body1" className="text-center">
          {description}
        </Typography>
      </div>
    </>
  );
};
