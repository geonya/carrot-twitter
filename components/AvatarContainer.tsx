import Avatar from './Avatar';

interface AvatarContainerProps {
  url?: string | null;
  big?: boolean;
}

export default function AvatarContainer({ url, big }: AvatarContainerProps) {
  return !url || url === '' ? (
    <div
      className={`${big ? 'w-32' : 'w-12'} ${
        big ? 'h-32' : 'h-12'
      } bg-slate-400 rounded-full grid place-content-center p-1`}
    >
      <svg
        className={`${big ? 'w-20' : 'w-12'} ${
          big ? 'h-20' : 'h-12'
        } stroke-zinc-500`}
        fill='none'
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          d='M12 6v6m0 0v6m0-6h6m-6 0H6'
        ></path>
      </svg>
    </div>
  ) : (
    <Avatar url={url} big={big} />
  );
}
