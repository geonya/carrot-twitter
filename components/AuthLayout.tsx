import Head from 'next/head';

interface LayoutProps {
  pageTitle?: string;
  children: React.ReactNode;
}

export default function AuthLayout({ pageTitle, children }: LayoutProps) {
  return (
    <div className='text-white grid lg:grid-cols-[4fr_3fr] divide-zinc-700 divide-x-[1px]'>
      <Head>
        <title>
          {pageTitle ? `${pageTitle} | 당근 트위터` : '당근 트위터'}
        </title>
      </Head>
      <div className='h-screen w-full flex justify-center items-start lg:order-2 min-w-[640px] shrink-0 flex-col p-12'>
        {children}
      </div>
      <div className="w-full h-screen bg-[url('https://abs.twimg.com/sticky/illustrations/lohp_1302x955.png')] flex justify-center items-center lg:order-1 shrink">
        <svg viewBox='0 0 24 24' className='fill-white w-1/2'>
          <g>
            <path d='M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z'></path>
          </g>
        </svg>
      </div>
    </div>
  );
}
