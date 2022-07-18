import { motion } from 'framer-motion';
import type { Dispatch, SetStateAction } from 'react';
interface BlackOutProps {
  toggleFn: Dispatch<SetStateAction<boolean>>;
}
export default function BlackOut({ toggleFn }: BlackOutProps) {
  return (
    <motion.div
      onClick={() => toggleFn(false)}
      className='absolute left-0 top-0 w-screen h-screen bg-[rgba(0,0,0,0.3)] z-20'
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { type: 'tween' },
      }}
      exit={{ opacity: 0 }}
    />
  );
}
