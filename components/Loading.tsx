import { Spinner } from '@chakra-ui/spinner';

export default function Loading({ white = false, big = false }) {
  return (
    <div className=' w-full grid place-content-center h-full'>
      <Spinner
        className={`${!big ? 'w-6 h-6' : 'w-10 h-10'} ${
          white ? 'text-white' : 'text-blue-500'
        }`}
      />
    </div>
  );
}
