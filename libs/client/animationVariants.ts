import type { Variants } from 'framer-motion';

export const containerVariants: Variants = {
  start: {
    opacity: 0,
    scale: 0,
  },
  end: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'tween',
      duration: 0.3,
      delayChildren: 0.3,
      staggerChildren: 0.5,
    },
  },
};

export const childrenVariants: Variants = {
  start: {
    opacity: 0,
    y: 30,
  },
  end: {
    opacity: 1,
    y: 0,
  },
};
