import { cookies } from 'next/headers';
import { I18N_COOKIE_NAME } from '~/i18n/i18n.settings';

async function getLanguageCookie() {
  const cookiesStore = await cookies();
  return cookiesStore.get(I18N_COOKIE_NAME)?.value;
}

export default getLanguageCookie;
