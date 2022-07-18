import { User } from '@prisma/client';
import useSWR from 'swr';

interface MeResponse {
  ok: boolean;
  error?: string;
  myProfile: User;
}

export default function useMe() {
  const { data, error } = useSWR<MeResponse>(
    typeof window === 'undefined' ? null : '/api/users/me'
  );
  return { data, error };
}
