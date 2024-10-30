import PageHeader from './components/pageHeader';
import Button from '~/core/ui/Button';

export const metadata = {
  title: `Dashboard`,
};

async function Page() {
  return (
    <>
      <PageHeader title="Dashboard" />
      <div className={'flex flex-col space-y-8'}>Home Page</div>
      <Button href="/dashboard/settings">Settings</Button>
    </>
  );
}

export default Page;
