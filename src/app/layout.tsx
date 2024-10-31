import './globals.css';

import initializeServerI18n from '~/i18n/i18n.server';
import Fonts from '~/components/Fonts';

import configuration from '~/configuration';
import getLanguageCookie from '~/i18n/get-language-cookie';
import { Toaster } from 'sonner';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const i18n = await initializeServerI18n(await getLanguageCookie());

  return (
    <html lang={i18n.language}>
      <Fonts />

      <body>
        <Toaster richColors={false} />
        {children}
      </body>
    </html>
  );
}

export const metadata = {
  title: configuration.site.name,
  description: configuration.site.description,
  metadataBase: new URL(configuration.site.siteUrl!),
  openGraph: {
    url: configuration.site.siteUrl,
    siteName: configuration.site.siteName,
    description: configuration.site.description,
  },
};
