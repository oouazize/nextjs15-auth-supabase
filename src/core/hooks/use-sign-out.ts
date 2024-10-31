import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import useSupabase from '~/core/hooks/use-supabase';

/**
 * @name useSignOut
 */
function useSignOut() {
  const client = useSupabase();
  const router = useRouter();

  return useCallback(async () => {
    await client.auth.signOut();
    router.refresh();
  }, [client.auth]);
}

export default useSignOut;
