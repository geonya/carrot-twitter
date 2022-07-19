import { Tweet, User } from '@prisma/client';

interface MutationResponseType {
  ok: boolean;
  [key: string]: any;
}
interface ITweet {
  id: number;
  tweetText: string;
  photo: string | null;
  userId: number;
  likeCount: number;
  originTweetId: number | null;
  reTweetCount: number;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  _count: {
    reTweets: number;
  };
}
interface TweetFormValue {
  file?: FileList;
  tweetText: string;
}

interface GetTweetsResponse {
  ok: boolean;
  tweets: ITweet[];
}

interface GetMyProfileResponse {
  ok: boolean;
  myProfile?: User;
}

interface UploadTweetResponse {
  ok: boolean;
  error?: string;
  tweet: ITweet;
}

interface GetTweetResponse {
  ok: boolean;
  tweet: ITweet;
  isLiked: boolean;
}

type NewTweetObjType = Partial<ITweet>;

interface IHashtag {
  id: number;
  tag: string;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    tweets: number;
  };
}
