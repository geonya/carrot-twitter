import { NextApiRequest, NextApiResponse } from 'next';
import S3 from 'aws-sdk/clients/s3';
import { MutationResponseType } from '../../types';
import withHandler from '../../libs/server/withHandler';
import { withApiSession } from '../../libs/server/withSession';

const s3 = new S3({
  region: 'ap-northeast-2',
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  signatureVersion: 'v4',
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MutationResponseType>
) {
  if (req.method === 'POST') {
    try {
      let { name, type } = req.body;
      const objectName = `photos/${name}-${Date.now()}`;
      const fileParams = {
        Bucket: 'carrot-twitter',
        Key: objectName,
        Expires: 600,
        ContentType: type,
      };
      const url = await s3.getSignedUrlPromise('putObject', fileParams);
      return res.json({ ok: true, url, objectName });
    } catch (error) {
      console.error(error);
      return res.json({ ok: false, error });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ['POST'],
    handler,
  })
);
