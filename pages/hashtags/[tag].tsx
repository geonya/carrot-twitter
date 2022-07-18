import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Layout from '../../components/Layout';
import NotFound from '../../components/NotFound';
import TweetsListContainer from '../../components/TweetListContainer';
import { ITweet } from '../../types';

interface GetHastagResponse {
  ok: boolean;
  error?: string;
  tweets?: ITweet[];
}

const HashTagPage: NextPage = () => {
  const router = useRouter();
  const tag = router.query?.tag as string;
  const { data } = useSWR<GetHastagResponse>(`/api/hashtags/${tag}`);
  return tag ? (
    <Layout pageTitle={tag}>
      <div className='min-h-[150px]'>
        <h1 className='font-bold text-xl p-5'>#{tag}</h1>
        {data && data.tweets && <TweetsListContainer tweets={data.tweets} />}
      </div>
    </Layout>
  ) : (
    <NotFound />
  );
};

export default HashTagPage;
