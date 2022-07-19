import { useRouter } from 'next/router';
import useSWR from 'swr';
import Layout from '../../components/Layout';
import Loading from '../../components/Loading';
import TweetBox from '../../components/TweetBox';
import TweetsListContainer from '../../components/TweetListContainer';
import WritingBox from '../../components/WritingBox';
import { GetTweetResponse, GetTweetsResponse, ITweet } from '../../types';

export default function TweetPage() {
  const router = useRouter();
  const { data } = useSWR<GetTweetResponse>(`/api/tweets/${router.query.id}`);
  const { data: reTweetsData } = useSWR<GetTweetsResponse>(
    `/api/tweets/${router.query.id}/re-tweets`
  );
  return (
    <Layout pageTitle='Tweet'>
      {data ? (
        <div className='divide-y-[0.5px] divide-dashed divide-zinc-700'>
          <TweetBox {...data.tweet} />
          {reTweetsData && reTweetsData.tweets ? (
            <>
              <WritingBox originTweetData={data} reTweet />
              <TweetsListContainer tweets={reTweetsData.tweets} reTweet />
            </>
          ) : (
            <Loading />
          )}
        </div>
      ) : (
        <Loading />
      )}
    </Layout>
  );
}
