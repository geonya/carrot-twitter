import Image from 'next/image';

interface AvatarProps {
  url: string;
  big?: boolean;
}

export default function Avatar({ url, big }: AvatarProps) {
  return (
    <Image
      width={big ? 128 : 48}
      height={big ? 128 : 48}
      src={url}
      className='bg-slate-400 rounded-full'
      alt='avatar-image'
    />
  );
}
