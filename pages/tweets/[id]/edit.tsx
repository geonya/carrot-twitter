import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../../../components/Layout';
import useMe from '../../../libs/client/useMe';
import { GetTweetResponse, TweetFormValue } from '../../../types';
import { AnimatePresence, motion } from 'framer-motion';
import TweetPhoto from '../../../components/TweetPhoto';
import Loading from '../../../components/Loading';
import useSWR from 'swr';
import useMutation from '../../../libs/client/useMutation';
import tweetEditFn from '../../../libs/client/tweetEditFn';
import Link from 'next/link';
import AvatarContainer from '../../../components/AvatarContainer';

interface EditTweetResponse {
  ok: boolean;
  error?: string;
}

const TweetEditPage: NextPage = () => {
  const router = useRouter();
  const { data: myData } = useMe();
  const { data } = useSWR<GetTweetResponse>(`/api/tweets/${router.query.id}`);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    setError,
    formState: { errors },
  } = useForm<TweetFormValue>({
    mode: 'onChange',
    defaultValues: {
      tweetText: data?.tweet.tweetText!,
    },
  });
  const fileWatch = watch('file');
  const [uploadPhoto, setUploadPhoto] = useState('');
  const [editTweet, { data: editResult, loading }] =
    useMutation<EditTweetResponse>(
      `/api/tweets/${router.query.id || data?.tweet.id}/edit`
    );
  const [deleteTweet, { data: deleteResult, loading: deleteLoading }] =
    useMutation<EditTweetResponse>(
      `
    /api/tweets/${router.query.id || data?.tweet.id}/edit
  `,
      'DELETE'
    );

  const onDeleteClick = () => {
    if (deleteLoading) return;
    deleteTweet({ id: router.query.id || data?.tweet.id });
    router.push('/');
  };

  const onSubmitValid = async ({ tweetText }: TweetFormValue) => {
    if (!router.query.id) return;
    if (!data) return;
    if (myData && !myData?.myProfile) return;

    await tweetEditFn({
      id: +router.query.id.toString() || data.tweet.id,
      tweetText,
      editTweet,
      fileWatch,
      uploadPhoto,
    });
  };
  useEffect(() => {
    if (fileWatch && fileWatch.length > 0) {
      const photoObj = fileWatch[0];
      setUploadPhoto(URL.createObjectURL(photoObj));
    }
  }, [fileWatch]);
  useEffect(() => {
    if (myData && !myData.ok) {
      router.push('/');
    }
  }, [myData, router]);
  useEffect(() => {
    if (data && data.error) {
      setError('result', { message: data.error });
    }
  }, [data, setError]);
  useEffect(() => {
    if (editResult && editResult.ok) {
      router.push('/');
    }
    if (editResult && editResult.error) {
      setError('result', { message: editResult.error });
    }
  }, [editResult, router, setError]);
  useEffect(() => {
    if (deleteResult && deleteResult.ok) {
      router.push('/');
    }
    if (deleteResult && deleteResult.error) {
      setError('result', { message: deleteResult.error });
    }
  }, [deleteResult, router, setError]);

  // Text Area Auto Height Set
  const { ref, ...rest } = register('tweetText', {
    required: 'Need to Write!',
    maxLength: { value: 140, message: '140자까지만 작성 가능' },
  });
  const tweetTextAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const handleResizeHeight = useCallback(() => {
    if (!tweetTextAreaRef.current) return;
    tweetTextAreaRef.current.style.height = 'auto';
    tweetTextAreaRef.current.style.height =
      tweetTextAreaRef.current.scrollHeight + 'px';
  }, [tweetTextAreaRef]);

  return (
    <Layout pageTitle='Edit Tweet'>
      <motion.div
        className='w-full flex justify-center items-center h-screen'
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: { type: 'tween' },
        }}
        exit={{ scale: 0, opacity: 0 }}
      >
        {data ? (
          <form
            className='w-4/5 space-y-6 flex flex-col items-center justify-center'
            onSubmit={handleSubmit(onSubmitValid)}
          >
            <label>
              <AnimatePresence>
                {data.tweet.photo || uploadPhoto ? (
                  <TweetPhoto url={uploadPhoto || data?.tweet.photo || ''} />
                ) : (
                  <div className='rounded-2xl cursor-pointer w-[360px] h-[240px] border-2 border-blue-500 border-dashed text-blue-500 grid place-content-center'>
                    <svg
                      className='w-20 h-20'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                      ></path>
                    </svg>
                  </div>
                )}
              </AnimatePresence>
              <input
                type='file'
                accept='image/*'
                {...register('file')}
                className='hidden'
              />
            </label>
            <div className='flex items-center space-x-4 self-start ml-5'>
              <Link href={`/users/${myData?.myProfile.username}`}>
                <div className='cursor-pointer'>
                  <AvatarContainer url={myData?.myProfile.avatar} />
                </div>
              </Link>
              <Link href={`/users/${myData?.myProfile.username}`}>
                <div className='flex items-center'>
                  <h4 className='font-bold text-base cursor-pointer'>
                    @{myData?.myProfile.username}
                  </h4>
                </div>
              </Link>
            </div>
            <textarea
              {...rest}
              className='text-base bg-transparent w-[95%] placeholder:text-zinc-500 resize-none py-2 px-5 border-[1px] border-zinc-700 rounded-3xl overflow-scroll scrollbar-hide'
              placeholder='Edit Your Tweet 🥕'
              rows={3}
              maxLength={140}
              onInput={handleResizeHeight}
              ref={(e) => {
                ref(e);
                tweetTextAreaRef.current = e;
              }}
              onKeyDown={async (e) => {
                if (e.code === 'Enter') {
                  e.preventDefault();
                  const tweetText = getValues('tweetText');
                  onSubmitValid({ tweetText });
                  setValue('tweetText', '');
                }
              }}
            />
            <span className='auth-error'>{errors.tweetText?.message}</span>
            <div className='w-full flex justify-between items-center px-5'>
              <div
                className='text-red-500 cursor-pointer'
                onClick={onDeleteClick}
              >
                <svg
                  className='w-8 h-8'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                  ></path>
                </svg>
              </div>
              {!loading ? (
                <input
                  className='bg-blue-500 w-28 mr-3 h-9 rounded-full cursor-pointer font-bold text-sm'
                  type='submit'
                  value={loading ? 'Loading...' : 'Edit Tweet'}
                />
              ) : (
                <div className='bg-blue-500 w-24 h-9 rounded-full cursor-pointer'>
                  <Loading white />
                </div>
              )}
            </div>
            <span className='auth-error'>{errors.result?.message}</span>
          </form>
        ) : (
          <Loading big />
        )}
      </motion.div>
    </Layout>
  );
};

export default TweetEditPage;
