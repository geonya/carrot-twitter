import { UploadTweetResponse } from '../../types';
import useMutation from './useMutation';

const upLoadReTweetFn = (tweetId: number) => {
  const [uploadReTweet, { loading }] = useMutation<UploadTweetResponse>(
    `/api/${tweetId}/re-tweets`
  );
  return { uploadReTweet, loading };
};

export default upLoadReTweetFn;
