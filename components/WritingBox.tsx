import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import useMe from '../libs/client/useMe';
import useMutation from '../libs/client/useMutation';
import {
  GetTweetResponse,
  TweetFormValue,
  UploadTweetResponse,
} from '../types';
import { AnimatePresence, motion } from 'framer-motion';
import AvatarContainer from './AvatarContainer';
import TweetPhoto from './TweetPhoto';
import tweetUploadFn from '../libs/client/tweetUploadFn';
import useSWR from 'swr';
import Loading from './Loading';

interface WritingBoxProps {
  originTweetData?: GetTweetResponse;
  setWritingModal?: Dispatch<SetStateAction<boolean>>;
  reTweet?: boolean;
}

interface TweetsCountResponse {
  ok: boolean;
  count: number;
}

export default function WritingBox({
  originTweetData,
  setWritingModal,
  reTweet = false,
}: WritingBoxProps) {
  const { data: myData } = useMe();
  const { register, handleSubmit, setValue, watch, getValues, reset } =
    useForm<TweetFormValue>({
      mode: 'onChange',
    });
  const fileWatch = watch('file');
  const [uploadPhoto, setUploadPhoto] = useState('');
  const { data: totalTweetsData } =
    useSWR<TweetsCountResponse>('/api/tweets/count');
  const [uploadTweet, { loading }] =
    useMutation<UploadTweetResponse>('/api/tweets');

  const onSubmitValid = async ({ tweetText }: TweetFormValue) => {
    if (loading) return;
    if (!myData?.myProfile) return;
    if (!totalTweetsData) return;

    // new tweet obj
    const newTweetObj = {
      id: totalTweetsData.count + 1,
      tweetText,
      photo: uploadPhoto,
      ...(reTweet && { originTweetId: originTweetData?.tweet.id }),
      likeCount: 0,
      reTweetCount: 0,
      userId: myData.myProfile.id,
      user: {
        ...myData.myProfile,
      },
    };
    setUploadPhoto('');
    setValue('tweetText', '');

    if (setWritingModal) {
      setWritingModal(false);
    }

    await tweetUploadFn({
      newTweetObj,
      uploadTweet,
      fileWatch,
    });
    reset();
  };
  useEffect(() => {
    if (fileWatch && fileWatch.length > 0) {
      const photoObj = fileWatch[0];
      setUploadPhoto(URL.createObjectURL(photoObj));
    }
  }, [fileWatch]);

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
    <motion.div
      className='w-full h-full'
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        transition: { type: 'tween' },
      }}
      exit={{ scale: 0, opacity: 0 }}
    >
      <form
        className='w-full grid grid-cols-[1fr_10fr] gap-4 p-6'
        onSubmit={handleSubmit(onSubmitValid)}
      >
        <div>
          {!reTweet ? (
            <AvatarContainer url={myData?.myProfile?.avatar} />
          ) : (
            <div className=''>
              <svg
                className='w-8 h-8 stroke-blue-500'
                fill='none'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M19 9l-7 7-7-7'
                ></path>
              </svg>
            </div>
          )}
        </div>
        <div className='w-full'>
          <div className='flex items-center mb-4'>
            <textarea
              {...rest}
              className='text-base bg-transparent w-[95%] resize-none py-4 px-4 ml-2 border-[1px] border-zinc-700 rounded-3xl overflow-scroll scrollbar-hide'
              placeholder={
                !reTweet
                  ? '무슨 일이 일어나고 있나요? 🥕'
                  : '예쁜 의견 남겨주세요 😄'
              }
              rows={1}
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
          </div>
          <AnimatePresence>
            {uploadPhoto !== '' ? <TweetPhoto url={uploadPhoto} /> : null}
          </AnimatePresence>
          <div className='mt-1 w-full min-h-[50px] flex justify-between items-center px-5'>
            <div className='text-blue-500 flex'>
              <label>
                <svg
                  className='w-8 h-8 cursor-pointer'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                  ></path>
                </svg>
                <input
                  type='file'
                  accept='image/*'
                  {...register('file')}
                  className='hidden'
                />
              </label>
              {/* Emoji Button
                   <svg
                    className='w-7 h-7 cursor-pointer'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    ></path>
                  </svg> */}
            </div>
            {!loading ? (
              <input
                className='bg-blue-500 w-24 h-9 rounded-full cursor-pointer font-bold text-sm'
                type='submit'
                value={loading ? 'Loading...' : 'Tweet'}
              />
            ) : (
              <div className='bg-blue-500 w-24 h-9 rounded-full cursor-pointer'>
                <Loading white />
              </div>
            )}
          </div>
        </div>
      </form>
    </motion.div>
  );
}
