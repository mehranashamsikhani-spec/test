import React, { useState, useEffect } from 'react';
import SplitText from './SplitText';

interface SplashScreenProps {
  onFinished: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinished }) => {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const handleAnimationComplete = () => {
    // A small delay before fading out for better visual effect
    setTimeout(() => {
        setIsAnimatingOut(true);
    }, 300);
  };

  useEffect(() => {
    if (isAnimatingOut) {
      const timer = setTimeout(() => {
        onFinished();
      }, 500); // This should match the fade out duration
      return () => clearTimeout(timer);
    }
  }, [isAnimatingOut, onFinished]);

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#F5F0E8] transition-opacity duration-500 ${isAnimatingOut ? 'opacity-0' : 'opacity-100'}`}
      aria-hidden={isAnimatingOut}
    >
      <SplitText
        text="ROMALG"
        tag="h1"
        className="text-6xl font-bold tracking-widest text-[#3D2412]"
        onAnimationComplete={handleAnimationComplete}
      />
    </div>
  );
};

export default SplashScreen;