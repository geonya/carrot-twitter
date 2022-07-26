import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  childrenVariants,
  containerVariants,
} from '../libs/client/animationVariants';
import { GetTweetsResponse } from '../types';
import Loading from './Loading';
import TweetBox from './TweetBox';

interface TweetsListContainerProps {
  tweetsData: GetTweetsResponse;
  reTweet?: boolean;
}

export default function TweetsListContainer({
  tweetsData,
  reTweet = false,
}: TweetsListContainerProps) {
  const [listLoading, setListLoading] = useState(false);
  useEffect(() => {
    if (!tweetsData || !tweetsData.ok || tweetsData.error) {
      setListLoading(true);
    } else {
      setListLoading(false);
    }
  }, [tweetsData]);
  if (listLoading) return <Loading big />;

  return (
    <motion.div
      className={`${
        listLoading ?? 'divide-zinc-700 divide-y-[0.5px] divide-dashed'
      }`}
      variants={containerVariants}
      initial='start'
      animate='end'
    >
      {tweetsData.tweets ? (
        tweetsData.tweets.map((tweet, i) => (
          <motion.div
            key={i}
            variants={childrenVariants}
            className={`${reTweet && 'grid grid-cols-[1fr_10fr] gap-4 pl-4'}`}
          >
            {reTweet && (
              <div className='flex justify-center items-start pt-5'>
                <div className=''>
                  <svg
                    className='w-8 h-8 stroke-blue-500'
                    fill='none'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M19 9l-7 7-7-7'
                    ></path>
                  </svg>
                </div>
              </div>
            )}
            <TweetBox tweet={tweet} />
          </motion.div>
        ))
      ) : (
        <Loading big />
      )}
    </motion.div>
  );
}
