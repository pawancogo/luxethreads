import React from 'react';
import { Link } from 'react-router-dom';

interface NavLogoProps {
  showFallback: boolean;
  setShowFallback: (show: boolean) => void;
}

const NavLogo: React.FC<NavLogoProps> = ({ showFallback, setShowFallback }) => {
  return (
    <Link to="/" className="flex-shrink-0">
      <div className="flex items-center">
        <img 
          src="/api/placeholder/40/36" 
          alt="Myntra" 
          className="h-9 w-auto"
          onError={() => setShowFallback(true)}
          style={{ display: showFallback ? 'none' : 'block' }}
        />
        <h1 className={`text-2xl font-bold text-pink-600 ${showFallback ? 'block' : 'hidden'}`}>
          LuxeThreads
        </h1>
      </div>
    </Link>
  );
};

export default NavLogo;
