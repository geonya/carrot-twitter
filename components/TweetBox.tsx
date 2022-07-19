import Link from 'next/link';
import useSWR, { useSWRConfig } from 'swr';
import { motion } from 'framer-motion';
import useMutation from '../libs/client/useMutation';
import AvatarContainer from './AvatarContainer';
import TweetPhoto from './TweetPhoto';
import { Tweet } from '@prisma/client';
import Loading from './Loading';
import { GetTweetResponse, ITweet } from '../types';
import useMe from '../libs/client/useMe';

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

export default function TweetBox({
  id,
  user,
  createdAt,
  tweetText,
  photo,
  likeCount,
}: TweetProps) {
  const { data: myData } = useMe();
  const { data, mutate: tweetMutate } = useSWR<GetTweetResponse>(
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
    likeMutation({});
  };

  return data && data.tweet ? (
    <motion.div className='grid grid-cols-[1fr_10fr] gap-4 p-5 pl-6 pr-6 relative'>
      <Link href={`/users/${user?.username}`}>
        <div className='cursor-pointer'>
          <AvatarContainer url={user?.avatar} />
        </div>
      </Link>
      <div className='flex flex-col ml-1'>
        <div className='flex items-end justify-start mb-4'>
          <Link href={`/users/${user?.username}`}>
            <div className='flex items-center'>
              <h4 className='font-bold text-base cursor-pointer'>
                @{user?.username}
              </h4>
            </div>
          </Link>
          <span className='font-thin text-zinc-400 text-xs ml-4'>
            {createdAt ? String(createdAt)?.substring(0, 10) : 'Now'}
          </span>
        </div>
        <Link href={`/tweets/${id}`}>
          <div className='absolute cursor-pointer top-0 right-0 w-0 h-0 border-t-[25px] border-t-blue-500 border-b-[25px] border-b-transparent border-r-[25px] border-r-blue-500 border-l-[25px] border-l-transparent'>
            <span className='text-xs font-semibold absolute -top-4 -right-5'>
              {id}
            </span>
          </div>
        </Link>
        <Link href={`/tweets/${id}`}>
          <a>
            <div className='my-5 flex'>
              {data.tweet.originTweetId && (
                <Link href={`/tweets/${data.tweet.originTweetId}`}>
                  <div className='text-blue-500 mr-2 flex items-center'>
                    <svg
                      className='w-5 h-5 mr-1'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6'
                      ></path>
                    </svg>
                    <span className=''>{data.tweet.originTweetId}</span>
                  </div>
                </Link>
              )}
              <span className='text-base'>{tweetText}</span>
            </div>
            <div className='my-5'>
              {photo ? <TweetPhoto url={photo} /> : null}
            </div>
          </a>
        </Link>

        <ul className='w-full flex items-center mt-5 space-x-5 text-zinc-500'>
          <Link href={`/tweets/${id}`}>
            <li className='flex space-x-2 items-center cursor-pointer'>
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6'
                ></path>
              </svg>
              <span className='text-sm'>
                {data.tweet._count?.reTweets || 0}
              </span>
            </li>
          </Link>
          <li
            className='flex space-x-2 items-center cursor-pointer'
            onClick={onLikeClick}
          >
            <svg
              className='w-5 h-5'
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
            <span className='text-sm'>
              {data?.tweet?.likeCount || likeCount}
            </span>
          </li>
          {myData?.myProfile.id === data.tweet.userId ? (
            <Link href={`/tweets/${id}/edit`}>
              <li className='cursor-pointer'>
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                  ></path>
                </svg>
              </li>
            </Link>
          ) : null}
        </ul>
      </div>
    </motion.div>
  ) : (
    <div className='w-full py-10'>
      <Loading />
    </div>
  );
}
