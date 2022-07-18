import Image from 'next/image';
import { motion } from 'framer-motion';

interface TweetPhotoProps {
  url: string;
}

export default function TweetPhoto({ url }: TweetPhotoProps) {
  return (
    <motion.div
      className='w-full flex justify-center items-center rounded-lg'
      initial={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.1, transition: { type: 'tween' } }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 1 }}
    >
      <Image
        className='rounded-2xl cursor-pointer object-cover'
        width={360}
        height={240}
        alt={url}
        src={url}
      />
    </motion.div>
  );
}
