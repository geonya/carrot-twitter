import { Tweet } from '@prisma/client';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Layout from '../../components/Layout';
import Loading from '../../components/Loading';
import ReTweetsListContainer from '../../components/ReTweetListContainer';
import TweetBox from '../../components/TweetBox';
import { GetTweetsResponse } from '../../types';

interface GetTweetProps {
  ok: boolean;
  tweet: Tweet;
  isLiked: boolean;
}

export default function TweetPage() {
  const router = useRouter();
  const { data } = useSWR<GetTweetProps>(`/api/tweets/${router.query.id}`);
  const { data: reTweetsData } = useSWR<GetTweetsResponse>(
    `/api/tweets/${router.query.id}/re-tweets`
  );
  return (
    <Layout pageTitle='Tweet'>
      <div className='h-5' />
      <div className='divide-y-[0.5px] divide-dashed divide-zinc-700'>
        {data ? <TweetBox {...data.tweet} /> : <Loading />}
        {data && reTweetsData && (
          <ReTweetsListContainer
            tweets={reTweetsData.tweets}
            originTweetId={data.tweet.id}
          />
        )}
      </div>
    </Layout>
  );
}
