import Image from 'next/image';
import { motion } from 'framer-motion';

interface TweetPhotoProps {
  url: string;
}

export default function TweetPhoto({ url }: TweetPhotoProps) {
  return (
    <motion.div
      className='w-full flex justify-center items-center rounded-lg z-50'
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.2, transition: { type: 'tween' } }}
      exit={{ scale: 1 }}
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
