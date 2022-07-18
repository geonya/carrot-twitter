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
  if (req.method === 'POST') {
    try {
      const {
        body: { username, password, email },
      } = req;
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });
      if (existingUser) {
        return res.json({ ok: false, error: 'User is Already Exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });
      return res.json({ ok: true });
    } catch (error) {
      console.error(error);
      return res.json({
        ok: false,
        error: "Can't Create Account",
      });
    }
  }
}

export default withApiSession(
  withHandler({ methods: ['POST'], handler, isPrivate: false })
);
