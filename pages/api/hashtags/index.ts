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
      } = req;
      if (!user) return res.json({ ok: false, error: 'not authrized' });
      const hashtags = await prisma.hashTag.findMany({
        include: {
          _count: {
            select: {
              tweets: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      return res.json({ ok: true, hashtags });
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
