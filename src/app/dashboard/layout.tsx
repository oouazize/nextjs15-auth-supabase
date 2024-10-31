import ScopeLayout from './components/ScopeLayout';
import loadAppData from '~/lib/server/loaders/load-app-data';

async function Layout({ children }: { children: React.ReactNode }) {
  const data = await loadAppData();

  return <ScopeLayout data={data}>{children}</ScopeLayout>;
}

export default Layout;
