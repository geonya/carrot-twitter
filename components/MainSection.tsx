import { useRouter } from 'next/router';
import { useState } from 'react';
import ToggleMenu from './ToggleMenu';

interface MainSectionProps {
  children: React.ReactNode;
}

export default function MainSection({ children }: MainSectionProps) {
  const router = useRouter();
  const [toggleMenuOn, setToggleMenuOn] = useState(false);
  return (
    <>
      <div className='sm:hidden w-full min-h-[60px] flex items-center justify-between px-5'>
        <span className='cursor-pointer p-1 ' onClick={() => router.back()}>
          <svg
            className='w-8 h-8'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M15 19l-7-7 7-7'
            ></path>
          </svg>
        </span>
        <span
          className='cursor-pointer p-1'
          onClick={() => setToggleMenuOn((prev) => !prev)}
        >
          <svg
            className='w-8 h-8'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M4 6h16M4 12h16m-7 6h7'
            ></path>
          </svg>
        </span>
        <ToggleMenu
          toggleMenuOn={toggleMenuOn}
          setToggleMenuOn={setToggleMenuOn}
        />
      </div>
      {children}
    </>
  );
}
