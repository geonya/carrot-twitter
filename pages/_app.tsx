import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SWRConfig } from 'swr';
import useMe from '../libs/client/useMe';
import '../styles.css';

export default function App({ Component, pageProps }: any) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          fetch(url).then((response) => response.json()),
      }}
    >
      <div className='w-full mx-auto'>
        <Component {...pageProps} />
      </div>
    </SWRConfig>
  );
}
