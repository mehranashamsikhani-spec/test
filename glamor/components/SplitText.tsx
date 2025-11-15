import React, { useRef, useLayoutEffect } from 'react';

// GSAP is loaded from script tags in index.html
declare const gsap: any;

interface SplitTextProps {
  text: string;
  tag?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  onAnimationComplete?: () => void;
}

const SplitTextComponent: React.FC<SplitTextProps> = ({
  text,
  tag = 'h1',
  className = '',
  delay = 80,
  duration = 0.6,
  ease = 'power3.out',
  onAnimationComplete,
}) => {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!ref.current || typeof gsap === 'undefined') {
      return;
    }

    const chars = ref.current.children;
    if (chars.length === 0) {
        if (onAnimationComplete) {
            onAnimationComplete();
        }
        return;
    };
    
    const animation = gsap.from(chars, {
      y: 40,
      opacity: 0,
      duration,
      ease,
      stagger: delay / 1000,
      onComplete: onAnimationComplete,
    });

    return () => {
      animation.kill();
    };
  }, [text, delay, duration, ease, onAnimationComplete]);

  const Tag = tag;

  // For accessibility, the parent has the full label, and children are hidden from screen readers.
  return (
    <Tag ref={ref as any} className={className} aria-label={text}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          style={{ display: 'inline-block', willChange: 'transform, opacity' }}
          aria-hidden="true"
        >
          {char}
        </span>
      ))}
    </Tag>
  );
};

export default SplitTextComponent;