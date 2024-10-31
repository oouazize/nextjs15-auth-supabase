'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import UserSessionContext from '~/core/session/contexts/user-session';
import UserData from '~/core/session/types/user-data';
import I18nProvider from '~/i18n/I18nProvider';
import CsrfTokenContext from '~/lib/contexts/csrf';
import loadAppData from '~/lib/server/loaders/load-app-data';

const ScopeLayout: React.FCC<{
  data: Awaited<ReturnType<typeof loadAppData>>;
}> = ({ data, children }) => {
  const userSessionContext: Maybe<UserData> = useMemo(() => {
    return data.user ?? undefined;
  }, [data]);

  const [userSession, setUserSession] =
    useState<Maybe<UserData>>(userSessionContext);

  const updateCurrentUser = useCallback(() => {
    if (userSessionContext?.id) {
      setUserSession(userSessionContext);
    }
  }, [userSessionContext]);

  useEffect(updateCurrentUser, [updateCurrentUser]);

  return (
    <UserSessionContext.Provider value={{ userSession, setUserSession }}>
      <CsrfTokenContext.Provider value={data.csrfToken}>
        <I18nProvider lang={data.language}>
          <main>

            {children}
          </main>
        </I18nProvider>
      </CsrfTokenContext.Provider>
    </UserSessionContext.Provider>
  );
};

export default ScopeLayout;
