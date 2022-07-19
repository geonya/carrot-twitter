import { NextApiRequest, NextApiResponse } from 'next';

export type Method = 'GET' | 'POST' | 'DELETE';

interface ConfigType {
  methods: Method[];
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
  isPrivate?: boolean;
}

export default function withHandler({
  methods,
  isPrivate = true,
  handler,
}: ConfigType) {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<any> {
    if (req.method && !methods.includes(req.method as any)) {
      return res.status(405).end();
    }
    if (isPrivate && !req.session.user) {
      return res.status(401).json({ ok: false, error: 'Login Please!' });
    }
    try {
      await handler(req, res);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error });
    }
  };
}
