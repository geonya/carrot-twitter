import { motion, AnimatePresence } from 'framer-motion';
import type { Dispatch, SetStateAction } from 'react';
import { GetTweetsResponse } from '../types';
import BlackOut from './BlackOut';
import WritingBox from './WritingBox';
interface ToggleWritingBoxContainerProps {
  data?: GetTweetsResponse;
  writingModal: boolean;
  setWritingModal: Dispatch<SetStateAction<boolean>>;
}
export default function ToggleWritingBoxContainer({
  data,
  writingModal,
  setWritingModal,
}: ToggleWritingBoxContainerProps) {
  return (
    <AnimatePresence>
      {writingModal && (
        <div className='fixed right-0 left-0 mx-auto -top-10 w-4/5 h-full z-10 flex items-center justify-center'>
          <BlackOut toggleFn={setWritingModal} />
          <motion.div
            className='absolute z-30 px-2 py-7 rounded-xl bg-zinc-900'
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: { type: 'tween' },
            }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <div
              className='absolute top-3 left-3 hover:border border-zinc-600 p-1 rounded-full cursor-pointer'
              onClick={() => setWritingModal(false)}
            >
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M6 18L18 6M6 6l12 12'
                ></path>
              </svg>
            </div>
            <div className='w-full h-7' />
            <WritingBox data={data} setWritingModal={setWritingModal} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
