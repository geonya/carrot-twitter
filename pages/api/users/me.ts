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
      if (!req.session.user)
        return res.json({ ok: false, error: 'User not found' });
      const myProfile = await prisma.user.findUnique({
        where: {
          id: req.session.user.id,
        },
      });
      return res.json({ ok: true, myProfile });
    } catch (error) {
      console.error(error);
      return res.json({ ok: false, error: 'User not found' });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  })
);
