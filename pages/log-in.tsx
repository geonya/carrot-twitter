import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import AuthLayout from '../components/AuthLayout';
import useMutation from '../libs/client/useMutation';

interface LoginFormValues {
  username: string;
  password: string;
}
interface LoginResponse {
  ok: boolean;
  error?: string;
}
const LogIn: NextPage = () => {
  const router = useRouter();
  const [loginMutation, { data, loading }] =
    useMutation<LoginResponse>('/api/users/log-in');
  const { register, handleSubmit } = useForm<LoginFormValues>({
    defaultValues: {
      username: router.query?.username ? (router.query.username as string) : '',
      password: router.query?.password ? (router.query.password as string) : '',
    },
    mode: 'onChange',
  });
  const onValid = (data: LoginFormValues) => {
    if (loading) return;
    loginMutation({
      ...data,
    });
  };
  useEffect(() => {
    if (data?.ok) {
      if (loading) return;
      router.push('/');
    }
  }, [data, router]);
  return (
    <AuthLayout pageTitle='로그인'>
      <div className='space-y-14'>
        <div>
          <svg viewBox='0 0 24 24' className='fill-white w-14'>
            <g>
              <path d='M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z'></path>
            </g>
          </svg>
        </div>
        <h1 className='xl:text-5xl lg:text-4xl md:text-4xl sm:text-4xl text-4xl font-semibold'>
          지금 일어나고 있는 일
        </h1>
        <h4 className='text-2xl font-bold'>
          오늘 당근 🥕 트위터에 가입하세요.
        </h4>
      </div>
      <form
        className='mt-9 flex flex-col w-full space-y-3 text-black'
        onSubmit={handleSubmit(onValid)}
      >
        <input
          className='w-5/6 max-w-[340px] px-5 py-2 rounded-full'
          type='text'
          {...register('username', { required: 'Please Write username' })}
          placeholder='Username'
        />
        <input
          className='w-5/6 max-w-[340px] px-5 py-2 rounded-full'
          type='password'
          {...register('password', { required: 'Please Write password' })}
          autoComplete='on'
          placeholder='Password'
        />
        <input
          className='w-5/6 max-w-[340px] px-5 py-2 rounded-full bg-blue-500 text-white cursor-pointer'
          type='submit'
          value={loading ? 'Loading...' : '로그인'}
        />
      </form>
      <div className='w-full mt-10 space-y-5'>
        <h4 className='text-white font-bold'>처음 이신가요?</h4>
        <Link href='/create-account'>
          <div className='w-5/6 max-w-[340px] px-5 py-2 rounded-full border border-blue-500 text-blue-500 cursor-pointer text-center'>
            <span>가입하기</span>
          </div>
        </Link>
      </div>
    </AuthLayout>
  );
};

export default LogIn;
