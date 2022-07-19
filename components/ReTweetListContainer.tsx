import { motion } from 'framer-motion';
import {
  childrenVariants,
  containerVariants,
} from '../libs/client/animationVariants';
import { ITweet } from '../types';
import TweetBox from './TweetBox';
import WritingBox from './WritingBox';

interface TweetsListContainerProps {
  tweets: ITweet[];
  originTweetId: number;
}

export default function ReTweetsListContainer({
  tweets,
  originTweetId,
}: TweetsListContainerProps) {
  return (
    <motion.div
      className='divide-zinc-700 divide-y-[0.5px] divide-dashed'
      variants={containerVariants}
      initial='start'
      animate='end'
    >
      {originTweetId && <WritingBox tweets={tweets} reTweet />}
      {tweets &&
        tweets.map((tweet, i) => (
          <motion.div
            key={i}
            variants={childrenVariants}
            className='grid grid-cols-[1fr_10fr] gap-4 pl-4'
          >
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
            <TweetBox {...tweet} />
          </motion.div>
        ))}
    </motion.div>
  );
}
