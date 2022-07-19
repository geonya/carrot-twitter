import { motion } from 'framer-motion';
import {
  childrenVariants,
  containerVariants,
} from '../libs/client/animationVariants';
import { ITweet } from '../types';
import TweetBox from './TweetBox';

interface TweetsListContainerProps {
  tweets: ITweet[];
}

export default function TweetsListContainer({
  tweets,
}: TweetsListContainerProps) {
  return (
    <motion.div
      className='divide-zinc-700 divide-y-[0.5px] divide-dashed'
      variants={containerVariants}
      initial='start'
      animate='end'
    >
      {tweets &&
        tweets.map((tweet, i) => (
          <motion.div key={i} variants={childrenVariants}>
            <TweetBox {...tweet} />
          </motion.div>
        ))}
    </motion.div>
  );
}
