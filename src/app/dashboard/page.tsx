import requireSession from '~/lib/user/require-session';
import initializeServerI18n from '~/i18n/i18n.server';
import getLanguageCookie from '~/i18n/get-language-cookie';

import I18nProvider from '~/i18n/I18nProvider';
import { getUserById } from '~/lib/user/database/queries';
import getSupabaseServerComponentClient from '~/core/supabase/server-component-client';

export const metadata = {
  title: `Dashboard`,
};

async function Page() {
  const client = getSupabaseServerComponentClient();
  const session = await requireSession(client);
  const userId = session.user.id;

  const { data: user } = await getUserById(client, userId);
  console.log('user', user);

  const i18n = await initializeServerI18n(await getLanguageCookie());

  return (
    <I18nProvider lang={i18n.language}>
      <div className={'flex flex-col space-y-8'}>Home Page</div>
    </I18nProvider>
  );
}

export default Page;
