import requireSession from '~/lib/user/require-session';
import getSupabaseServerActionClient from '~/core/supabase/action-client';

/**
 * @name withSession
 * @param fn
 * export const action = withSession(async (params) => {
 *   //
 * })
 */
export function withSession<Args extends any[], Response>(
  fn: (...params: Args) => Response,
) {
  return async (...params: Args) => {
    const client = getSupabaseServerActionClient();

    await requireSession(client);

    return fn(...params);
  };
}
