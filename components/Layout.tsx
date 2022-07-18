import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';
import useMe from '../libs/client/useMe';
import { GetMyProfileResponse } from '../types';
import LeftNav from './LeftNav';
import RightNav from './RightNav';

interface LayoutProps {
  pageTitle?: string;
  children: React.ReactNode;
}

export default function Layout({ pageTitle, children }: LayoutProps) {
  const router = useRouter();
  const { myProfile, isLoading } = useMe();
  useEffect(() => {
    if (!myProfile && !isLoading) {
      router.push('/log-in');
    }
  }, [myProfile, isLoading, router]);
  return (
    <div className='text-zinc-200 grid md:grid-cols-[1fr_1fr_1fr] sm:grid-cols-[1fr_2fr] divide-zinc-700 divide-x-[1px] '>
      <Head>
        <title>
          {pageTitle ? `${pageTitle} | 당근 트위터` : '당근 트위터'}
        </title>
      </Head>
      <div className='sm:block hidden'>
        <LeftNav />
      </div>
      <div className='min-w-[375px] h-screen overflow-scroll'>{children}</div>
      <div className='md:block hidden'>
        <RightNav />
      </div>
    </div>
  );
}
