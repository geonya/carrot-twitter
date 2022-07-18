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
import { GetTweetsResponse, ITweet, TweetFormValue } from '../types';
import { motion } from 'framer-motion';
import AvatarContainer from './AvatarContainer';
import TweetPhoto from './TweetPhoto';
import uploadFunction from '../libs/client/uploadFunction';

interface WritingBoxProps {
  data?: GetTweetsResponse;
  setWritingModal?: Dispatch<SetStateAction<boolean>>;
}

interface UploadTweetResponse {
  ok: boolean;
  error?: string;
  tweet?: ITweet;
}

export default function WritingBox({ data, setWritingModal }: WritingBoxProps) {
  const { data: myData } = useMe();
  const { register, handleSubmit, setValue, watch, getValues } =
    useForm<TweetFormValue>({
      mode: 'onChange',
    });
  const [uploadPhoto, setUploadPhoto] = useState('');
  const [uploadTweet, { loading }] =
    useMutation<UploadTweetResponse>('/api/tweets');

  const fileWatch = watch('file');

  const onSubmitValid = async ({ tweetText }: TweetFormValue) => {
    if (loading) return;
    if (!data || !data.tweets) return;
    if (!myData?.myProfile) return;
    console.log('upload');
    // new tweet obj
    const newTweetObj = {
      id: data.tweets.length + 1,
      tweetText,
      photo: uploadPhoto,
      likeCount: 0,
      user: {
        id: myData.myProfile.id,
        username: myData.myProfile.username,
        avatar: myData.myProfile.avatar,
      },
    };
    await uploadFunction({ data, newTweetObj, uploadTweet, fileWatch });
    setValue('tweetText', '');
    setUploadPhoto('');
    if (setWritingModal) {
      setWritingModal(false);
    }
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
          <AvatarContainer url={myData?.myProfile?.avatar} />
        </div>
        <div className='w-full'>
          <div className='flex items-center mb-4'>
            <textarea
              {...rest}
              className='text-base bg-transparent w-[95%] placeholder:text-zinc-500 resize-none py-2 px-4 ml-1 border-[1px] border-zinc-700 rounded-3xl'
              placeholder='무슨 일이 일어나고 있나요?'
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
          {uploadPhoto !== '' ? <TweetPhoto url={uploadPhoto} /> : null}
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
            <input
              className='bg-blue-500 px-6 py-1.5 rounded-full cursor-pointer font-bold text-sm'
              type='submit'
              value='Tweet'
            />
          </div>
        </div>
      </form>
    </motion.div>
  );
}
