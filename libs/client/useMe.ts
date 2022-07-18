import { User } from '@prisma/client';
import useSWR from 'swr';

interface MeResponse {
  ok: boolean;
  myProfile: User;
}

export default function useMe() {
  const { data, error } = useSWR<MeResponse>('/api/users/me');
  return { myProfile: data?.myProfile, isLoading: !data && !error };
}
