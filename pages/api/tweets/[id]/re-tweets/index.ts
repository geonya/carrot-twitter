import { NextApiRequest, NextApiResponse } from 'next';
import { makeHashtagObjs } from '../../../../../libs/client/makeHashtag';
import { MutationResponseType } from '../../../../../types';
import prisma from '../../../../../libs/server/prisma';
import { withApiSession } from '../../../../../libs/server/withSession';
import withHandler from '../../../../../libs/server/withHandler';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MutationResponseType>
) {
  if (req.method === 'GET') {
    const {
      query: { id },
    } = req;
    if (!id) return res.json({ ok: false, error: 'no id' });
    try {
      const reTweets = await prisma.tweet.findMany({
        where: {
          originTweetId: +id?.toString(),
        },
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      });
      return res.json({ ok: true, tweets: reTweets });
    } catch (error) {
      console.error(error);
      return res.json({ ok: false, error: 'Get Tweets Error' });
    }
  }
  if (req.method === 'POST') {
    try {
      const {
        body: { originTweetId, tweetText, photo },
        session: { user },
      } = req;
      console.log(originTweetId, tweetText, photo);
      if (!user) {
        return res.json({ ok: false, error: 'Not authorized' });
      }
      const hashTagObjs = makeHashtagObjs(tweetText);
      const tweet = await prisma.tweet.create({
        data: {
          tweetText,
          ...(photo && { photo: photo }),
          user: {
            connect: {
              id: user.id,
            },
          },
          originTweet: {
            connect: {
              id: originTweetId,
            },
          },
          ...(hashTagObjs.length > 0 && {
            hashtags: {
              connectOrCreate: hashTagObjs,
            },
          }),
        },
      });
      return res.json({ ok: true, tweet });
    } catch (error) {
      console.error(error);
      return res.json({ ok: false, error: "Can't Create Tweet" });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET', 'POST'],
    handler,
  })
);
