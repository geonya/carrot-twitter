import { motion } from 'framer-motion';
import Link from 'next/link';
import useSWR from 'swr';
import {
  childrenVariants,
  containerVariants,
} from '../libs/client/animationVariants';
import { IHashtag } from '../types';
import Loading from './Loading';

export interface GetHashTagsResponse {
  ok: boolean;
  error?: string;
  hashtags?: IHashtag[];
}

export default function RightNav() {
  const { data } = useSWR<GetHashTagsResponse>('/api/hashtags');
  return (
    <nav className='w-full flex justify-start items-center py-10 pl-5'>
      <motion.ul
        className='space-y-5 w-1/2 '
        variants={containerVariants}
        initial='start'
        animate='end'
      >
        {data ? (
          data.hashtags &&
          data.hashtags.map((hashtag, i) => (
            <Link href={`/hashtags/${hashtag.tag}`} key={i}>
              <motion.li
                variants={childrenVariants}
                className='w-[80%] py-2 justify-center text-center cursor-pointer border border-transparent hover:border hover:border-zinc-700 rounded-full'
              >
                <span className='lg:text-base md:text-sm text-sm font-semibold'>
                  #{hashtag.tag} ({hashtag._count?.tweets})
                </span>
              </motion.li>
            </Link>
          ))
        ) : (
          <div className='h-screen'>
            <Loading big />
          </div>
        )}
      </motion.ul>
    </nav>
  );
}
