import Heading from '~/core/ui/Heading';
import PageHeader from './components/pageHeader';

export const metadata = {
  title: `Dashboard`,
};

async function Page() {
  return (
    <>
      <PageHeader title="Dashboard" />
      <div className={'flex flex-col space-y-8'}>Home Page</div>
    </>
  );
}

export default Page;
