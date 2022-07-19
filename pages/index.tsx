import { Tweet } from '@prisma/client';
import { NextPage } from 'next';
import useSWR, { SWRConfig } from 'swr';
import Layout from '../components/Layout';
import TweetsListContainer from '../components/TweetListContainer';
import WritingBox from '../components/WritingBox';
import { GetTweetsResponse } from '../types';
import prisma from '../libs/server/prisma';

const Home: NextPage = () => {
  const { data } = useSWR<GetTweetsResponse>('/api/tweets');
  return (
    <Layout pageTitle='Home'>
      <div className='divide-zinc-700 divide-y-[0.5px] divide-dashed'>
        <div className='min-h-[200px]'>
          <h1 className='font-bold text-xl p-5'>Home</h1>
          {data && data.tweets && <WritingBox tweets={data.tweets} />}
        </div>
        {/* Load All Tweets */}
        {data && <TweetsListContainer tweets={data.tweets} />}
      </div>
    </Layout>
  );
};

const Page: NextPage<{ tweets: Tweet[] }> = ({ tweets }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          '/api/tweets': {
            ok: true,
            tweets,
          },
        },
      }}
    >
      <Home />
    </SWRConfig>
  );
};

export async function getStaticProps() {
  console.log('building statically');
  const tweets = await prisma.tweet.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
  return {
    props: {
      tweets: JSON.parse(JSON.stringify(tweets)),
    },
    revalidate: 10,
  };
}

export default Page;
