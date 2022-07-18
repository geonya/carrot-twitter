import { Tweet } from '@prisma/client';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Layout from '../../components/Layout';
import TweetBox from '../../components/TweetBox';

interface GetTweetProps {
  ok: boolean;
  tweet: Tweet;
  isLiked: boolean;
}

export default function TweetPage() {
  const router = useRouter();
  const { data } = useSWR<GetTweetProps>(`/api/tweets/${router.query.id}`);
  return (
    <Layout pageTitle='Tweet'>
      <div className='h-8' />
      {data && <TweetBox {...data.tweet} />}
    </Layout>
  );
}
