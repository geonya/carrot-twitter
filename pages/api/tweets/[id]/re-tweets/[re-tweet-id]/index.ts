import { NextApiRequest, NextApiResponse } from 'next';
import withHandler from '../../../../../../libs/server/withHandler';
import { withApiSession } from '../../../../../../libs/server/withSession';
import { MutationResponseType } from '../../../../../../types';
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MutationResponseType>
) {
  if (req.method === 'POST') {
    try {
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
