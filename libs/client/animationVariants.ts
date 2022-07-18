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
      duration: 0.1,
      delayChildren: 0.1,
      staggerChildren: 0.2,
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
