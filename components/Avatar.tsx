import Image from 'next/image';

interface AvatarProps {
  url: string;
  big?: boolean;
}

export default function Avatar({ url, big }: AvatarProps) {
  return (
    <Image
      width={big ? 128 : 50}
      height={big ? 128 : 50}
      src={url}
      className='w-12 h-12 bg-slate-400 rounded-full'
      alt='avatar-image'
    />
  );
}
