import { NextApiRequest, NextApiResponse } from 'next';
import { MutationResponseType } from '../../../types';
import client from '../../../libs/server/prisma';
import { makeHashtagObjs } from '../../../libs/client/makeHashtag';
import { withApiSession } from '../../../libs/server/withSession';
import withHandler from '../../../libs/server/withHandler';
import prisma from '../../../libs/server/prisma';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MutationResponseType>
) {
  if (req.method === 'GET') {
    try {
      const tweets = await prisma.tweet.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      });
      return res.json({ ok: true, tweets });
    } catch (error) {
      console.error(error);
      return res.json({ ok: false, error: 'Get Tweets Error' });
    }
  }
  if (req.method === 'POST') {
    try {
      const {
        body: { tweetText, photo },
        session: { user },
      } = req;
      if (!user) {
        return res.json({ ok: false, error: 'Not authorized' });
      }
      const hashTagObjs = makeHashtagObjs(tweetText);
      const tweet = await client.tweet.create({
        data: {
          tweetText,
          ...(photo && { photo: photo }),
          user: {
            connect: {
              id: user.id,
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
