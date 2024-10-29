import Link from 'next/link';
import LogoImage from './LogoImage';
import Heading from '../Heading';

const Logo: React.FCC<{
  href?: string;
  className?: string;
  label?: string;
}> = ({ href, label, className }) => {
  return (
    <Link aria-label={label ?? 'Home Page'} href={href ?? '/'}>
      {/* <LogoImage className={className} /> */}
      <Heading type={1}>LogoName</Heading>
    </Link>
  );
};

export default Logo;
