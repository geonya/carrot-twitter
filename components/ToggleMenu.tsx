import { motion, AnimatePresence } from 'framer-motion';
import LeftNav from './LeftNav';
import type { Dispatch, SetStateAction } from 'react';
import BlackOut from './BlackOut';

interface ToggleMenuProps {
  toggleMenuOn: boolean;
  setToggleMenuOn: Dispatch<SetStateAction<boolean>>;
}

export default function ToggleMenu({
  toggleMenuOn,
  setToggleMenuOn,
}: ToggleMenuProps) {
  return (
    <AnimatePresence>
      {toggleMenuOn && (
        <>
          <BlackOut toggleFn={setToggleMenuOn} />
          <motion.div
            className='absolute right-10 top-14 bg-zinc-800 rounded-lg z-50 py-10 flex justify-center items-start w-[250px]'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LeftNav />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
