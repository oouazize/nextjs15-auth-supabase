import { UserAttributes } from '@supabase/supabase-js';
import useMutation from 'swr/mutation';

import useSupabase from '~/core/hooks/use-supabase';

type Params = { arg: UserAttributes & { redirectTo: string } };

/**
 * @name useUpdateUserMutation
 */
function useUpdateUserMutation() {
  const client = useSupabase();
  const key = ['auth', 'update-user'];

  return useMutation(key, (_, { arg: attributes }: Params) => {
    const { redirectTo, ...params } = attributes;

    return client.auth
      .updateUser(params, {
        emailRedirectTo: redirectTo,
      })
      .then((response: any) => {
        if (response.error) {
          throw response.error;
        }

        return response.data;
      });
  });
}

export default useUpdateUserMutation;
