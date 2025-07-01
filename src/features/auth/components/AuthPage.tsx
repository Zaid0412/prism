import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const location = useLocation();
  const isSignUp = location.pathname === '/signup';

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-900'>
      <div className='p-8 rounded shadow-lg'>
        {isSignUp ? (
          <SignUp routing='path' path='/signup' />
        ) : (
          <SignIn routing='path' path='/login' />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
