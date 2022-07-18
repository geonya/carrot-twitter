import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../libs/server/prisma';
import withHandler from '../../../libs/server/withHandler';
import { withApiSession } from '../../../libs/server/withSession';
import { MutationResponseType } from '../../../types';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MutationResponseType>
) {
  if (req.method === 'GET') {
    try {
      const {
        session: { user },
        query: { tag },
      } = req;
      if (typeof tag !== 'string')
        return res.json({ ok: false, error: 'wrong type tag' });
      if (!user) return res.json({ ok: false, error: 'not authrized' });
      const hashtag = await prisma.hashTag.findUnique({
        where: {
          tag,
        },
      });
      if (!hashtag)
        return res.json({
          ok: false,
          error: 'not found hashtag',
        });
      const tweets = await prisma.tweet.findMany({
        where: {
          hashtags: {
            some: {
              tag,
            },
          },
        },
        include: {
          user: true,
        },
      });
      if (tweets && tweets.length === 0) {
        return res.json({ ok: false, error: 'tweets not found' });
      }
      return res.json({ ok: true, tweets });
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
