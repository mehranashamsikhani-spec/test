
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full p-4 flex justify-between items-center sticky top-0 bg-[#3D2412] shadow-md z-10">
      <div className="flex-1"></div>
      <h1 className="text-3xl font-bold tracking-widest text-white text-center flex-1">
        GLAMOR
      </h1>
      <div className="flex-1"></div>
    </header>
  );
};

export default Header;