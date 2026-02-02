'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import gsap from 'gsap';

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

export function AnimatedCounter({
  target,
  duration = 2,
  delay = 0,
  prefix = '',
  suffix = '',
  className,
  decimals = 0,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated && ref.current) {
      setHasAnimated(true);
      const obj = { value: 0 };

      gsap.to(obj, {
        value: target,
        duration,
        delay,
        ease: 'power2.out',
        onUpdate: () => {
          if (ref.current) {
            const formattedValue = decimals > 0
              ? obj.value.toFixed(decimals)
              : Math.round(obj.value).toLocaleString('es-ES');
            ref.current.textContent = `${prefix}${formattedValue}${suffix}`;
          }
        },
      });
    }
  }, [isInView, hasAnimated, target, duration, delay, prefix, suffix, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
