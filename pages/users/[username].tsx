import { User } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWR, { useSWRConfig } from 'swr';
import AvatarContainer from '../../components/AvatarContainer';
import Layout from '../../components/Layout';
import Loading from '../../components/Loading';
import NotFound from '../../components/NotFound';
import { BUCKET_URL } from '../../libs/client/constants';
import useMe from '../../libs/client/useMe';
import useMutation from '../../libs/client/useMutation';

interface AvatarFormValue {
  file: FileList;
  password: string;
  bio: string;
}

interface GetUserResponse {
  ok: boolean;
  error?: string;
  user?: User | null;
}
interface EditProfileResponse {
  ok: boolean;
  error?: string;
}
interface UploadFunctionProps {
  password?: string;
  bio?: string;
}

export default function Profile() {
  const { register, handleSubmit, watch } = useForm<AvatarFormValue>({
    mode: 'onChange',
  });
  const fileWatch = watch('file');
  const router = useRouter();
  const { data: myData } = useMe();
  const [isMe, setIsMe] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState('');

  const onValid = async ({ password, bio }: AvatarFormValue) => {
    if (!isMe) return;
    await uploadFunction({ password, bio });
  };
  const { mutate } = useSWRConfig();
  const { data } = useSWR<GetUserResponse>(
    `/api/users/${router.query.username}`
  );
  const [editProfile, { loading }] = useMutation<EditProfileResponse>(
    `/api/users/${router.query.username}`
  );

  async function uploadFunction({ password, bio }: UploadFunctionProps) {
    if (loading) return;
    if (fileWatch && fileWatch.length > 0) {
      const file = fileWatch[0];
      const {
        data: { url, objectName },
      } = await axios.post('/api/upload-avatar', {
        name: file.name,
        type: file.type,
      });
      await axios.put(url, file, {
        headers: {
          'Content-type': file.type,
          'Access-Control-Allow-Origin': '*',
        },
      });
      const avatar = BUCKET_URL + objectName;
      editProfile({
        avatar,
        password,
        bio,
      });
      mutate(
        `/api/users/${router.query.username}`,
        {
          ...data,
          user: {
            ...data?.user,
            avatar: avatar,
            bio,
          },
        },
        false
      );
      setPreviewAvatar('');
    } else {
      editProfile({
        password,
        bio,
      });
      mutate(
        `/api/users/${router.query.username}`,
        {
          ...data,
          user: {
            ...data?.user,
            bio,
          },
        },
        false
      );
    }
  }

  useEffect(() => {
    if (!router.query.username || !myData) return;
    setIsMe(myData.myProfile?.username === router.query.username);
  }, [router, myData]);
  useEffect(() => {
    if (fileWatch && fileWatch.length > 0) {
      const photoObj = fileWatch[0];
      setPreviewAvatar(URL.createObjectURL(photoObj));
    }
  }, [fileWatch]);
  return (
    <Layout pageTitle='My Profile'>
      {!data ? (
        <Loading />
      ) : !data.ok || !data.user ? (
        <NotFound />
      ) : (
        <div className='w-full flex justify-center items-center h-screen'>
          <div className='min-h-[500px] flex flex-col items-center space-y-8 w-full'>
            <h1 className='font-bold text-2xl'>@{data.user.username}</h1>
            <form
              onSubmit={handleSubmit(onValid)}
              className={`w-full flex flex-col items-center justify-center space-y-7`}
            >
              <label className='cursor-pointer'>
                <AvatarContainer
                  url={previewAvatar === '' ? data.user.avatar : previewAvatar}
                  big
                />
                <input
                  {...register('file')}
                  type='file'
                  accept='image/*'
                  className='hidden'
                />
              </label>
              <input
                className='text-base w-3/5 placeholder:text-zinc-500 p-2 ml-1 border-[1px] border-zinc-700 rounded-3xl text-center'
                type='text'
                placeholder={data.user.email}
                disabled
              />
              {isMe && (
                <>
                  <input
                    className='text-base bg-transparent w-3/5 placeholder:text-zinc-500 p-2 ml-1 border-[1px] border-zinc-700 rounded-3xl text-center'
                    type='password'
                    {...register('password')}
                    placeholder='Password'
                    autoComplete='on'
                  />
                </>
              )}
              <textarea
                className={`text-base bg-transparent w-3/5 placeholder:text-zinc-500 p-3 ml-1 ${
                  isMe ? 'border-[1px] border-zinc-700' : null
                } rounded-2xl resize-none`}
                rows={3}
                {...register('bio', { maxLength: 100 })}
                placeholder={'내 소개'}
                defaultValue={data.user.bio || ''}
                disabled={!isMe}
              />
              {isMe && (
                <>
                  <input
                    className='w-3/5 px-5 py-2 rounded-full bg-blue-500 text-white cursor-pointer'
                    type='submit'
                    value={loading ? 'Loading...' : '수정하기'}
                  />
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
