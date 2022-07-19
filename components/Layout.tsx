import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import LeftNav from './LeftNav';
import RightNav from './RightNav';
import ToggleMenu from './ToggleMenu';

interface LayoutProps {
  pageTitle?: string;
  children: React.ReactNode;
}

export default function Layout({ pageTitle, children }: LayoutProps) {
  const router = useRouter();
  const [toggleMenuOn, setToggleMenuOn] = useState(false);
  return (
    <main className='text-zinc-200 grid md:grid-cols-[1fr_1.5fr_1fr] sm:grid-cols-[1fr_2fr] divide-zinc-700 divide-x-[0.5px] divide-dashed'>
      <Head>
        <title>
          {pageTitle ? `${pageTitle} | 당근 트위터` : '당근 트위터'}
        </title>
      </Head>
      <section className='sm:block hidden'>
        <LeftNav />
      </section>
      <section className='sm:min-w-[500px] min-w-[375px] h-screen overflow-scroll'>
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
      </section>
      <section className='md:block hidden'>
        <RightNav />
      </section>
    </main>
  );
}
