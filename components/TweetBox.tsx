import Link from 'next/link';
import useSWR, { mutate } from 'swr';
import { motion } from 'framer-motion';
import useMutation from '../libs/client/useMutation';
import AvatarContainer from './AvatarContainer';
import TweetPhoto from './TweetPhoto';
import Loading from './Loading';
import { GetTweetResponse, ITweet } from '../types';
import useMe from '../libs/client/useMe';
import { useEffect, useState } from 'react';

interface TweetBoxProps {
  tweet: ITweet;
}
interface GetLikeResponse {
  ok: boolean;
  error?: string;
  isLiked?: boolean;
}

export default function TweetBox({ tweet }: TweetBoxProps) {
  const [boxLoading, setBoxLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  useEffect(() => {
    if (!tweet) {
      setBoxLoading(true);
    } else {
      setBoxLoading(false);
    }
  }, [tweet]);
  if (boxLoading) return <Loading big />;

  const { data: myData } = useMe();

  useEffect(() => {
    if (!myData || !myData.ok || !myData.myProfile || myData.error) {
      setUserLoading(true);
    } else {
      setUserLoading(false);
    }
  }, [myData]);

  // const { data, mutate: tweetMutate } = useSWR<GetTweetResponse>(
  //   `/api/tweets/${id}`
  // );

  const { data: tweetData, mutate: tweetMutate } = useSWR<GetTweetResponse>(
    `/api/tweets/${tweet.id}`
  );

  const [likeMutation] = useMutation(`/api/tweets/${tweet.id}/like`);

  const onLikeClick = async () => {
    await tweetMutate((prev: any) => {
      if (!prev) return;
      const likeCount = prev.isLiked
        ? prev.tweet.likeCount - 1
        : prev.tweet.likeCount + 1;
      return {
        ...prev,
        isLiked: !prev.isLiked,
        tweet: { ...prev.tweet, likeCount },
      };
    }, false);
    likeMutation({});
  };

  const { data: likeData } = useSWR<GetLikeResponse>(
    `/api/tweets/${tweet.id}/like`
  );
  const [likeLoading, setLikeLoading] = useState(false);
  useEffect(() => {
    if (!likeData || !likeData.ok || likeData.error) {
      setLikeLoading(true);
    } else {
      setLikeLoading(false);
    }
  }, [likeData]);

  return (
    <motion.div className='grid grid-cols-[1fr_10fr] gap-4 p-5 pl-6 pr-6 relative'>
      {userLoading ? (
        <Loading />
      ) : (
        <Link href={`/users/${myData?.myProfile.username}`}>
          <div className='cursor-pointer'>
            <AvatarContainer url={myData?.myProfile.avatar} />
          </div>
        </Link>
      )}
      <div className='flex flex-col ml-1'>
        <div className='flex items-end justify-start mb-4'>
          <Link href={`/users/${myData?.myProfile.username}`}>
            <div className='flex items-center'>
              <h4 className='font-bold text-base cursor-pointer'>
                @{myData?.myProfile.username}
              </h4>
            </div>
          </Link>
          <span className='font-thin text-zinc-400 text-xs ml-4'>
            {tweet.createdAt
              ? String(tweet.createdAt)?.substring(0, 10)
              : 'Now'}
          </span>
        </div>
        <Link href={`/tweets/${tweet.id}`}>
          <div className='absolute cursor-pointer top-0 right-0 w-0 h-0 border-t-[25px] border-t-blue-500 border-b-[25px] border-b-transparent border-r-[25px] border-r-blue-500 border-l-[25px] border-l-transparent'>
            <span className='text-xs font-semibold absolute -top-4 -right-5'>
              {tweet.id}
            </span>
          </div>
        </Link>
        <Link href={`/tweets/${tweet.id}`}>
          <a>
            <div className='my-5 flex'>
              {tweet.originTweetId && (
                <Link href={`/tweets/${tweet.originTweetId}`}>
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
                    <span className=''>{tweet.originTweetId}</span>
                  </div>
                </Link>
              )}
              <span className='text-base'>{tweet.tweetText}</span>
            </div>
            <div className='my-5'>
              {tweet.photo ? <TweetPhoto url={tweet.photo} /> : null}
            </div>
          </a>
        </Link>

        <ul className='w-full flex items-center mt-5 space-x-5 text-zinc-500'>
          <Link href={`/tweets/${tweet.id}`}>
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
              <span className='text-sm'>{tweet._count?.reTweets || 0}</span>
            </li>
          </Link>
          {likeLoading ? (
            <Loading />
          ) : (
            <li
              className='flex space-x-2 items-center cursor-pointer'
              onClick={onLikeClick}
            >
              <motion.svg
                className='w-5 h-5'
                fill={tweetData?.isLiked ? 'tomato' : 'none'}
                stroke={tweetData?.isLiked ? 'tomato' : 'currentColor'}
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 1 } }}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                ></path>
              </motion.svg>
              <span className='text-sm'>{tweetData?.tweet.likeCount}</span>
            </li>
          )}
          {myData?.myProfile.id === tweet.userId ? (
            <Link href={`/tweets/${tweet.id}/edit`}>
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
  );
}
