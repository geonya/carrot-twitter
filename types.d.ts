import { Tweet, User } from '@prisma/client';

interface MutationResponseType {
  ok: boolean;
  [key: string]: any;
}
interface ITweet extends Tweet {
  user?: User;
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
