import axios from 'axios';
import { mutate } from 'swr';
import { GetHashTagsResponse } from '../../components/RightNav';
import { GetTweetsResponse } from '../../types';
import { BUCKET_URL } from './constants';
import { makeHashtagArrays } from './makeHashtag';

interface NewTweetObjType {
  id: number;
  tweetText: string;
  photo?: string | null;
  likeCount: number;
  user?: {
    id?: number;
    username?: string;
    avatar?: string | null;
  };
}
interface uploadFunctionProps {
  newTweetObj: NewTweetObjType;
  data: GetTweetsResponse;
  fileWatch?: FileList;
  uploadTweet: (data: any) => void;
}

export default async function uploadFunction({
  data,
  newTweetObj,
  fileWatch,
  uploadTweet,
}: uploadFunctionProps) {
  await mutate(
    '/api/tweets',
    {
      ...data,
      tweets: [newTweetObj, ...data?.tweets!],
    },
    false
  );
  await mutate(
    `/api/tweets/${newTweetObj.id}`,
    {
      ok: true,
      isLiked: false,
      tweet: newTweetObj,
    },
    false
  );
  const hashtags = makeHashtagArrays(newTweetObj.tweetText).map((hashtag) => ({
    tag: hashtag,
    _count: {
      tweets: 1,
    },
  }));
  await mutate(
    `/api/hashtags`,
    (prev: GetHashTagsResponse) => ({
      ...prev,
      hashtags: [...hashtags, ...prev?.hashtags!],
    }),
    false
  );
  if (fileWatch && fileWatch.length > 0) {
    const file = fileWatch[0];
    const {
      data: { url, objectName },
    } = await axios.post('/api/upload', {
      name: file.name,
      type: file.type,
    });
    await axios.put(url, file, {
      headers: {
        'Content-type': file.type,
        'Access-Control-Allow-Origin': '*',
      },
    });
    const photo = BUCKET_URL + objectName;
    uploadTweet({
      tweetText: newTweetObj.tweetText,
      photo,
    });
  } else {
    uploadTweet({
      tweetText: newTweetObj.tweetText,
    });
  }
}
