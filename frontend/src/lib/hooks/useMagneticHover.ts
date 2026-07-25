import { useEffect, useState } from 'react';
import { useSpring, useMotionValue } from 'framer-motion';

export function useMagneticHover(ref: React.RefObject<HTMLElement | null>, strength: number = 0.5, maxRadius: number = 16) {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return;
      const { clientX, clientY } = e;
      const { left, top, width, height } = element.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      let offsetX = (clientX - centerX) * strength;
      let offsetY = (clientY - centerY) * strength;

      // Cap the radius
      const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
      if (distance > maxRadius) {
        offsetX = (offsetX / distance) * maxRadius;
        offsetY = (offsetY / distance) * maxRadius;
      }

      x.set(offsetX);
      y.set(offsetY);
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      x.set(0);
      y.set(0);
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref, isHovered, strength, maxRadius, x, y]);

  return { x: smoothX, y: smoothY, isHovered };
}
