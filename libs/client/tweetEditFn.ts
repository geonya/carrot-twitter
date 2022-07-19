import axios from 'axios';
import { mutate } from 'swr';
import { GetHashTagsResponse } from '../../components/RightNav';
import { GetTweetResponse } from '../../types';

import { BUCKET_URL } from './constants';
import { makeHashtagArrays } from './makeHashtag';

interface TweetEditFnProps {
  id: number;
  tweetText: string;
  fileWatch?: FileList;
  uploadPhoto?: string;
  editTweet: (data: any) => void;
}

export default async function tweetEditFn({
  id,
  fileWatch,
  editTweet,
  tweetText,
  uploadPhoto,
}: TweetEditFnProps) {
  const newHashtags = makeHashtagArrays(tweetText).map((tag) => ({
    tag,
    _count: {
      tweets: 1,
    },
  }));
  await mutate(
    `/api/tweets/${id}`,
    (prev: GetTweetResponse) => ({
      ...prev,
      tweet: {
        ...prev.tweet,
        id,
        tweetText,
        photo: uploadPhoto,
      },
    }),
    false
  );
  await mutate(
    `/api/hashtags`,
    (prev: GetHashTagsResponse) => {
      const newTags = newHashtags.map((hashtag) => hashtag.tag);
      const duplicateTags: string[] = [];
      const oldFilteredHashtags = prev.hashtags!.map((hashtag) => {
        if (newTags.includes(hashtag.tag)) {
          duplicateTags.push(hashtag.tag);
          return {
            ...hashtag,
            _count: {
              tweets: hashtag._count.tweets + 1,
            },
          };
        }
        return hashtag;
      });
      const newFilteredHashtags = newHashtags.filter(
        (hashtag) => !duplicateTags.includes(hashtag.tag)
      );
      return {
        ...prev,
        hashtags: [...newFilteredHashtags, ...oldFilteredHashtags],
      };
    },
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
    editTweet({
      id,
      tweetText,
      photo,
    });
  } else {
    editTweet({
      id,
      tweetText,
    });
  }
}
