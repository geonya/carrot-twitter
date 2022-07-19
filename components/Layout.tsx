import Head from 'next/head';
import LeftNav from './LeftNav';
import MainSection from './MainSection';
import RightNav from './RightNav';

interface LayoutProps {
  pageTitle?: string;
  children: React.ReactNode;
}

export default function Layout({ pageTitle, children }: LayoutProps) {
  return (
    <main className='h-screen text-zinc-200 grid md:grid-cols-[1fr_1.5fr_1fr] sm:grid-cols-[1fr_2fr] divide-zinc-700 divide-x-[0.5px] divide-dashed overflow-scroll scrollbar-hide'>
      <Head>
        <title>
          {pageTitle ? `${pageTitle} | 당근 트위터` : '당근 트위터'}
        </title>
      </Head>
      <section className='sm:block hidden  overflow-scroll scrollbar-hide'>
        <LeftNav />
      </section>
      <section className='sm:min-w-[500px] min-w-[375px] overflow-scroll scrollbar-hide'>
        <MainSection>{children}</MainSection>
      </section>
      <section className='md:block hidden overflow-scroll scrollbar-hide'>
        <RightNav />
      </section>
    </main>
  );
}
