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
          <AppLogo size={42} className="ml-5 mr-5" />Block <span className="font-bold">Trek</span>
        </div>
      </Link>
    </div>
  );
}

export default Logo;
