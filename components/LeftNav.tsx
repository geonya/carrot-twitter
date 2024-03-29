import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useMe from '../libs/client/useMe';
import useMutation from '../libs/client/useMutation';
import Loading from './Loading';
import ToggleWritingBoxContainer from './ToggleWritingBoxContainer';

export default function LeftNav() {
  const router = useRouter();
  const { data: myData } = useMe();
  const [logout, { data: logoutResult, loading }] =
    useMutation(`/api/users/log-out`);
  const [writingModal, setWritingModal] = useState(false);
  const onLogoutClick = () => {
    router.push('/log-in');
    logout({});
  };
  useEffect(() => {
    if (logoutResult?.ok) {
      router.push('/log-in');
    }
  }, [logoutResult, loading, router]);
  return (
    <nav className='sm:w-full flex sm:justify-end justify-center items-center h-full'>
      <ul className='flex flex-col items-center space-y-8 sm:px-14 mr-0'>
        <Link href={'/'}>
          <li className='w-36 py-2 justify-center flex items-center space-x-4 cursor-pointer border border-transparent hover:border hover:border-zinc-700 hover:rounded-full'>
            <svg
              className='w-7 h-7'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z'></path>
            </svg>
            <span className='lg:text-lg text-base font-semibold'>Home</span>
          </li>
        </Link>
        <Link href={'/search'}>
          <li className='w-36 py-2 justify-center flex items-center space-x-4 cursor-pointer border border-transparent hover:border hover:border-zinc-700 hover:rounded-full'>
            <svg
              className='w-7 h-7'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              ></path>
            </svg>
            <span className='lg:text-lg text-base font-semibold'>Search</span>
          </li>
        </Link>
        <Link href={`/users/${myData?.myProfile?.username}`}>
          <li className='w-36 py-2 flex justify-center items-center space-x-4 cursor-pointer border border-transparent hover:border hover:border-zinc-700 hover:rounded-full'>
            <svg
              className='w-7 h-7'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z'
              ></path>
            </svg>
            <span className='lg:text-lg text-base font-semibold'>Profile</span>
          </li>
        </Link>
        <li
          className='w-36 h-10 bg-blue-500 rounded-full cursor-pointer grid place-content-center'
          onClick={() => setWritingModal(true)}
        >
          <span className='lg:text-lg md:text-base text-base font-semibold'>
            Tweet
          </span>
        </li>
        <ToggleWritingBoxContainer
          writingModal={writingModal}
          setWritingModal={setWritingModal}
        />
        {!loading ? (
          <li
            className='w-36 h-10 border-2 border-blue-500 rounded-full cursor-pointer grid place-content-center'
            onClick={onLogoutClick}
          >
            <span className='text-blue-500 lg:text-lg md:text-base text-base font-semibold'>
              Log Out
            </span>
          </li>
        ) : (
          <div className='w-36 h-10 border-2 border-blue-500 rounded-full cursor-pointer grid place-content-center'>
            <Loading />
          </div>
        )}
      </ul>
    </nav>
  );
}
