import { motion } from 'framer-motion';
import {
  childrenVariants,
  containerVariants,
} from '../libs/client/animationVariants';
import { ITweet } from '../types';
import Loading from './Loading';
import TweetBox from './TweetBox';

interface TweetsListContainerProps {
  tweets: ITweet[];
  reTweet?: boolean;
}

export default function TweetsListContainer({
  tweets,
  reTweet = false,
}: TweetsListContainerProps) {
  const loading = !tweets;
  return (
    <motion.div
      className={`${
        loading ?? 'divide-zinc-700 divide-y-[0.5px] divide-dashed'
      }`}
      variants={containerVariants}
      initial='start'
      animate='end'
    >
      {tweets ? (
        tweets.map((tweet, i) => (
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
            <TweetBox {...tweet} />
          </motion.div>
        ))
      ) : (
        <Loading />
      )}
    </motion.div>
  );
}
