import { redirect } from 'next/navigation';
import configuration from '~/configuration';

export default function page() {
  redirect(configuration.paths.appHome);
}
