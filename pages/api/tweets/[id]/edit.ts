import { NextApiRequest, NextApiResponse } from 'next';
import { makeHashtagObjs } from '../../../../libs/client/makeHashtag';
import prisma from '../../../../libs/server/prisma';
import withHandler from '../../../../libs/server/withHandler';
import { withApiSession } from '../../../../libs/server/withSession';
import { MutationResponseType } from '../../../../types';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MutationResponseType>
) {
  if (req.method === 'POST') {
    try {
      const {
        body: { id, tweetText, photo },
        session: { user },
      } = req;
      const tweet = await prisma.tweet.findUnique({
        where: {
          id,
        },
        select: {
          userId: true,
        },
      });
      if (!tweet) return res.json({ ok: false, error: 'no tweet' });
      if (!user || tweet.userId !== user?.id)
        return res.json({ ok: false, error: 'not authorized' });

      const hashTagObjs = makeHashtagObjs(tweetText);

      await prisma.tweet.update({
        where: {
          id,
        },
        data: {
          tweetText,
          ...(photo && { photo: photo }),
          ...(hashTagObjs.length > 0 && {
            hashtags: {
              connectOrCreate: hashTagObjs,
            },
          }),
        },
      });

      return res.json({ ok: true });
    } catch (error) {
      console.error(error);
      return res.json({ ok: false, error });
    }
  }
  if (req.method === 'DELETE') {
    const {
      body: { id },
      session: { user },
    } = req;
    const tweet = await prisma.tweet.findUnique({
      where: {
        id: +id.toString(),
      },
      select: {
        userId: true,
      },
    });
    if (!tweet) return res.json({ ok: false, error: 'no tweet' });
    if (!user || tweet.userId !== user?.id)
      return res.json({ ok: false, error: 'not authorized' });

    await prisma.tweet.delete({
      where: {
        id: +id.toString(),
      },
    });
    return res.json({ ok: true });
  }
}

export default withApiSession(
  withHandler({
    methods: ['POST', 'DELETE'],
    handler,
  })
);
