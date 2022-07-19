import { NextApiRequest, NextApiResponse } from 'next';
import { MutationResponseType } from '../../../../../types';
import prisma from '../../../../../libs/server/prisma';
import { withApiSession } from '../../../../../libs/server/withSession';
import withHandler from '../../../../../libs/server/withHandler';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MutationResponseType>
) {
  // Get Re-tweets
  if (req.method === 'GET') {
    const {
      query: { id },
    } = req;
    if (!id) return res.json({ ok: false, error: 'no id' });
    try {
      const tweets = await prisma.tweet.findMany({
        where: {
          originTweetId: +id?.toString(),
        },
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      });
      return res.json({ ok: true, tweets });
    } catch (error) {
      console.error(error);
      return res.json({ ok: false, error: 'Get Tweets Error' });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  })
);
