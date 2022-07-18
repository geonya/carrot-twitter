import { NextPage } from 'next';
import useSWR from 'swr';
import Layout from '../components/Layout';
import TweetsListContainer from '../components/TweetListContainer';
import WritingBox from '../components/WritingBox';
import { GetTweetsResponse } from '../types';

const Home: NextPage = () => {
  const { data } = useSWR<GetTweetsResponse>('/api/tweets');
  return (
    <Layout pageTitle='Home'>
      <div className='divide-zinc-700 divide-y-[1px]'>
        <div className='min-h-[200px]'>
          <h1 className='font-bold text-xl p-5'>Home</h1>
          {data && <WritingBox data={data} />}
        </div>
        {/* Load All Tweets */}
        {data && <TweetsListContainer tweets={data.tweets} />}
      </div>
    </Layout>
  );
};

export default Home;
