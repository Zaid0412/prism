// src/features/app/components/Header.tsx
import React from 'react';
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from '@clerk/clerk-react';

const Header: React.FC = () => {
  const { isSignedIn, user, isLoaded } = useUser();

  return (
    <header className='w-full flex items-center justify-between p-4 py-6 border-b bg-gray-800 shadow-lg border-b border-gray-700'>
      <div className='text-2xl font-bold text-white'></div>
      <div>
        {!isLoaded ? null : isSignedIn ? (
          <div className='flex items-center gap-3 p-1'>
            <span className='text-white px-2 py-1'>
              {user?.primaryEmailAddress?.emailAddress}
            </span>
            <UserButton afterSignOutUrl='/' />
          </div>
        ) : (
          <div className='flex gap-3'>
            <SignInButton mode='modal'>
              <button className='relative px-5 py-2 rounded-lg font-semibold shadow-md bg-gradient-to-r from-indigo-500 to-slate-700 text-white overflow-hidden group focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all duration-200'>
                <span className="relative z-10">Login</span>
                <span className="absolute inset-0 z-0 bg-gradient-to-r from-indigo-600 to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </SignInButton>
            <SignUpButton mode='modal'>
              <button className='relative px-5 py-2 rounded-lg font-semibold shadow-md bg-gradient-to-r from-slate-600 to-gray-800 text-white overflow-hidden group focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-all duration-200'>
                <span className="relative z-10">Sign Up</span>
                <span className="absolute inset-0 z-0 bg-gradient-to-r from-slate-700 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </SignUpButton>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
