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
    const {
      query: { id },
      session: { user },
    } = req;
    if (!id) return res.json({ ok: false, error: 'no id' });
    if (!user) return res.json({ ok: false, error: 'not authorized' });
    const tweetId = +id.toString();
    const like = await prisma.like.findFirst({
      where: {
        userId: user.id,
        tweetId: tweetId,
      },
    });
    if (like) {
      return res.json({ ok: true, isLiked: true });
    } else {
      return res.json({ ok: true, isLiked: false });
    }
  }
  if (req.method === 'POST') {
    try {
      const {
        query: { id },
        session: { user },
      } = req;
      if (!id) return res.json({ ok: false, error: 'no id' });
      const existingLike = await prisma.like.findFirst({
        where: {
          userId: user?.id,
          tweetId: +id,
        },
      });
      if (existingLike) {
        await prisma.like.delete({
          where: {
            id: existingLike.id,
          },
        });
        const likeCount = await prisma.like.count({
          where: {
            tweetId: +id,
          },
        });
        await prisma.tweet.update({
          where: {
            id: +id,
          },
          data: {
            likeCount,
          },
        });
        return res.json({ ok: true });
      }
      await prisma.like.create({
        data: {
          user: {
            connect: {
              id: user?.id,
            },
          },
          tweet: {
            connect: {
              id: +id,
            },
          },
        },
      });
      const likeCount = await prisma.like.count({
        where: {
          tweetId: +id,
        },
      });
      await prisma.tweet.update({
        where: {
          id: +id,
        },
        data: {
          likeCount,
        },
      });
      return res.json({ ok: true });
    } catch (error) {
      console.error(error);
      return res.json({ ok: false, error });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET', 'POST'],
    handler,
  })
);
