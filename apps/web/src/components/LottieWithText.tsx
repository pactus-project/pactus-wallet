import React from 'react';
import Lottie from 'react-lottie-player';

interface LottieWithTextProps {
  animationData: object | { default: object };
  title?: string;
  description: string;
  animationClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export const LottieWithText: React.FC<LottieWithTextProps> = ({
  animationData,
  title,
  description,
  animationClassName = '',
  titleClassName = '',
  descriptionClassName = '',
}) => {
  return (
    <>
      <Lottie
        animationData={animationData}
        loop={true}
        play
        className={animationClassName}
        aria-hidden="true"
      />
      {title && <h1 className={titleClassName}>{title}</h1>}
      <p className={descriptionClassName}>{description}</p>
    </>
  );
};
