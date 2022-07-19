import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../libs/server/prisma';
import withHandler from '../../../../libs/server/withHandler';
import { withApiSession } from '../../../../libs/server/withSession';
import { MutationResponseType } from '../../../../types';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MutationResponseType>
) {
  if (req.method === 'GET') {
    try {
      const {
        query: { id },
        session: { user },
      } = req;
      if (!id) return res.json({ ok: false, error: 'no id' });
      const tweet = await prisma.tweet.findUnique({
        where: {
          id: +id.toString(),
        },
        include: {
          user: true,
          reTweets: true,
          _count: {
            select: {
              reTweets: true,
            },
          },
        },
      });
      if (!tweet) return res.json({ ok: false, error: 'no tweet' });

      const isLiked = Boolean(
        await prisma.like.findFirst({
          where: {
            userId: user?.id,
            tweetId: +id.toString(),
          },
        })
      );
      return res.json({ ok: true, tweet, isLiked });
    } catch (error) {
      console.error(error);
      return res.json({ ok: false, error });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  })
);
