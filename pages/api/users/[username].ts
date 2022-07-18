import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { MutationResponseType } from '../../../types';
import prisma from '../../../libs/server/prisma';
import { withApiSession } from '../../../libs/server/withSession';
import withHandler from '../../../libs/server/withHandler';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MutationResponseType>
) {
  if (req.method === 'GET') {
    const {
      query: { username },
    } = req;
    try {
      if (!username) return res.json({ ok: false, error: 'no username' });
      const user = await prisma.user.findUnique({
        where: { username: username.toString() },
      });
      if (!user) return res.json({ ok: false, error: 'User Not Found.' });
      return res.json({ ok: true, user });
    } catch (error) {
      console.error(error);
      return res.json({ ok: false, error: 'Find Error' });
    }
  }
  if (req.method === 'POST') {
    const {
      body: { password, bio, avatar },
      session: { user },
    } = req;
    try {
      if (!user) {
        return res.json({ ok: false, error: 'Not authorized' });
      }
      const foundUser = await prisma.user.findUnique({
        where: { id: +user.id.toString() },
      });
      if (!foundUser) {
        return res.json({ ok: false, error: 'User not found' });
      }
      if (avatar) {
        await prisma.user.update({
          where: {
            id: +user.id.toString(),
          },
          data: {
            avatar,
          },
        });
      }
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
          where: {
            id: +user.id.toString(),
          },
          data: {
            password: hashedPassword,
          },
        });
      }
      if (bio) {
        await prisma.user.update({
          where: {
            id: +user.id.toString(),
          },
          data: {
            bio,
          },
        });
      }
      return res.json({ ok: true });
    } catch (error) {
      console.error(error);
      return res.json({ ok: false, error: 'User not found' });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET', 'POST'],
    handler,
  })
);
