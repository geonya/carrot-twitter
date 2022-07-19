import { NextApiRequest, NextApiResponse } from 'next';
import { MutationResponseType } from '../../../types';
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
      const count = await prisma.tweet.count({});
      return res.json({ ok: true, count });
    } catch (error) {
      console.error(error);
      return res.json({ ok: false, error: "Can't Create ReTweet" });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  })
);
