import axios from 'axios';
import { mutate } from 'swr';
import { GetHashTagsResponse } from '../../components/RightNav';
import { GetTweetsResponse, NewTweetObjType } from '../../types';
import { BUCKET_URL } from './constants';
import { makeHashtagArrays } from './makeHashtag';

interface uploadFunctionProps {
  newTweetObj: NewTweetObjType;
  fileWatch?: FileList;
  uploadTweet: (data: any) => void;
}

export default async function tweetUploadFn({
  newTweetObj,
  fileWatch,
  uploadTweet,
}: uploadFunctionProps) {
  if (!newTweetObj.tweetText) return;

  await mutate(
    '/api/tweets',
    (prev: GetTweetsResponse) => ({
      ...prev,
      tweets: [newTweetObj, ...prev.tweets],
    }),
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
  if (newTweetObj.originTweetId) {
    await mutate(
      `/api/tweets/${newTweetObj.originTweetId}/re-tweets`,
      (prev: GetTweetsResponse) => ({
        ...prev,
        tweets: [newTweetObj, ...prev.tweets],
      }),
      false
    );
  }
  const newHashtags = makeHashtagArrays(newTweetObj.tweetText).map((tag) => ({
    tag,
    _count: {
      tweets: 1,
    },
  }));

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
    uploadTweet({
      tweetText: newTweetObj.tweetText,
      photo,
      ...(newTweetObj.originTweetId && {
        originTweetId: newTweetObj.originTweetId,
      }),
    });
  } else {
    uploadTweet({
      tweetText: newTweetObj.tweetText,
      ...(newTweetObj.originTweetId && {
        originTweetId: newTweetObj.originTweetId,
      }),
    });
  }
}
