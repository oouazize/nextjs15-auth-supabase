import requireSession from '~/lib/user/require-session';
import initializeServerI18n from '~/i18n/i18n.server';
import getLanguageCookie from '~/i18n/get-language-cookie';

import I18nProvider from '~/i18n/I18nProvider';
import getSupabaseServerComponentClient from '~/core/supabase/server-component-client';

async function Layout({ children }: { children: React.ReactNode }) {
  const client = getSupabaseServerComponentClient();
  await requireSession(client);
  const i18n = await initializeServerI18n(await getLanguageCookie());

  return <I18nProvider lang={i18n.language}>{children}</I18nProvider>;
}

export default Layout;
