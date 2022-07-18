import { NextPage } from 'next';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useMutation from '../libs/client/useMutation';
import AuthLayout from '../components/AuthLayout';

interface CreateAccountForm {
  email: string;
  username: string;
  password: string;
}
interface CreateAccountResponse {
  ok: boolean;
  error?: string;
}

const CreateAccount: NextPage = () => {
  const router = useRouter();
  const [createAccount, { data, loading }] =
    useMutation<CreateAccountResponse>('/api/users/sign-up');
  const { register, handleSubmit, getValues } = useForm<CreateAccountForm>();
  const onValid = (data: CreateAccountForm) => {
    if (loading) return;
    createAccount({ ...data });
  };
  useEffect(() => {
    if (data?.ok) {
      router.push({
        pathname: '/log-in',
        query: {
          username: getValues('username'),
          password: getValues('password'),
        },
      });
    }
    if (data?.error) {
      alert(data.error);
    }
  }, [data, router, getValues]);
  return (
    <AuthLayout pageTitle='Sign Up'>
      <div className='space-y-14'>
        <div>
          <svg viewBox='0 0 24 24' className='fill-white w-14'>
            <g>
              <path d='M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z'></path>
            </g>
          </svg>
        </div>
        <h1 className='text-5xl font-bold'>지금 가입하세요.</h1>
      </div>
      <form
        className='mt-9 flex flex-col w-full space-y-3 text-black'
        onSubmit={handleSubmit(onValid)}
      >
        <input
          className='auth-input'
          type='text'
          {...register('username', { required: 'Please Write username' })}
          placeholder='Username'
        />
        <input
          className='auth-input'
          type='text'
          {...register('email', { required: 'Please Write username' })}
          placeholder='E-Mail'
        />
        <input
          className='auth-input'
          type='password'
          {...register('password', { required: 'Please Write password' })}
          placeholder='Password'
          autoComplete='on'
        />
        <input
          className='auth-input bg-blue-500 text-white cursor-pointer'
          type='submit'
          value={loading ? 'Loading...' : '가입하기'}
        />
      </form>
      <div className='w-full mt-10 space-y-5'>
        <h4 className='text-white font-bold'>이미 트위터에 가입하셨나요?</h4>
        <Link href='/log-in'>
          <div className='auth-input border border-blue-500 text-blue-500 cursor-pointer text-center'>
            <span>로그인</span>
          </div>
        </Link>
      </div>
    </AuthLayout>
  );
};

export default CreateAccount;
