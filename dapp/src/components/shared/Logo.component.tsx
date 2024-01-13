import Link from 'next/link';
import React from 'react';
import AppLogo from '@/assets/logo';

interface LogoProps {
  href: string;
}

const Logo: React.FC<LogoProps> = ({ href }) => {
  return (
    <div className="flex">
      <Link href={href}>
        <div className="flex btn-ghost rounded-full p-2">
          <AppLogo size={30} className="ml-1 mt-1 mr-2" />Block <span className="font-bold">Trek</span>
        </div>
      </Link>
    </div>
  );
}

export default Logo;
