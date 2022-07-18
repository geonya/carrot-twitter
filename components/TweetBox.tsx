import Link from 'next/link';
import useSWR, { useSWRConfig } from 'swr';
import { motion } from 'framer-motion';
import useMutation from '../libs/client/useMutation';
import AvatarContainer from './AvatarContainer';
import TweetPhoto from './TweetPhoto';
import { Tweet } from '@prisma/client';

interface TweetProps {
  id: number;
  user?: {
    avatar?: string | null;
    username: string;
  };
  createdAt: Date;
  tweetText: string;
  photo?: string | null;
  likeCount?: number;
}
interface GetTweetMutation {
  ok: boolean;
  tweet: Tweet;
  isLiked: boolean;
}

export default function TweetBox({
  id,
  user,
  createdAt,
  tweetText,
  photo,
  likeCount,
}: TweetProps) {
  const { mutate } = useSWRConfig();
  const { data, mutate: tweetMutate } = useSWR<GetTweetMutation>(
    `/api/tweets/${id}`
  );
  const [likeMutation] = useMutation(`/api/tweets/${id}/like`);
  const onLikeClick = () => {
    if (!data) return;
    tweetMutate((prev: any) => {
      if (!prev) return;
      const likeCount = prev.isLiked
        ? prev.tweet?.likeCount - 1
        : prev.tweet?.likeCount + 1;
      return {
        ...prev,
        isLiked: !prev.isLiked,
        tweet: { ...prev.tweet, likeCount },
      };
    }, false);
    mutate(`/api/users/me`, (prev: any) => ({ ...prev, ok: !prev.ok }), false);
    likeMutation({});
  };

  return (
    <motion.div className='grid grid-cols-[1fr_10fr] p-6 gap-4'>
      <Link href={`/users/${user?.username}`}>
        <div className='cursor-pointer'>
          <AvatarContainer url={user?.avatar} />
        </div>
      </Link>
      <div className='flex flex-col'>
        <div className='flex items-center justify-between mb-4'>
          <Link href={`/users/${user?.username}`}>
            <h4 className='font-bold text-base cursor-pointer'>
              @{user?.username}
            </h4>
          </Link>
          <span className='font-thin text-zinc-400 text-xs'>
            {createdAt ? String(createdAt)?.substring(0, 10) : 'Now'}
          </span>
        </div>
        <Link href={`/tweets/${id}`}>
          <a>
            <div className='mb-5'>
              <span className='text-base'>{tweetText}</span>
            </div>
            {photo ? <TweetPhoto url={photo} /> : null}
          </a>
        </Link>

        <ul className='w-full flex items-center mt-5 space-x-5 text-zinc-500'>
          <li className='flex space-x-2 items-center cursor-pointer'>
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
                d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
              ></path>
            </svg>
            <span>{data?.tweet?.commentCount}</span>
          </li>
          <li
            className='flex space-x-2 items-center cursor-pointer'
            onClick={onLikeClick}
          >
            <svg
              className='w-6 h-6'
              fill={data?.isLiked ? 'tomato' : 'none'}
              stroke={data?.isLiked ? 'tomato' : 'currentColor'}
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
              ></path>
            </svg>
            <span>{data?.tweet?.likeCount || likeCount}</span>
          </li>
        </ul>
      </div>
    </motion.div>
  );
}
