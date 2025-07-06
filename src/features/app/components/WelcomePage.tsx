import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const WelcomePage: React.FC = () => {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/timer');
    }
  }, [isSignedIn, isLoaded, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-4xl mx-auto">
        {/* Logo/Title Section */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent mb-4">
            Prism
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Your Ultimate Rubik's Cube Timer
          </p>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 ease-in-out">
            <div className="text-3xl mb-4">⏱️</div>
            <h3 className="text-xl font-semibold mb-2">Precise Timing</h3>
            <p className="text-gray-400">
              Accurate millisecond timing with keyboard controls for the best solving experience.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 ease-in-out">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Detailed Statistics</h3>
            <p className="text-gray-400">
              Track your progress with comprehensive statistics and solve history.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 ease-in-out">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Multiple Puzzles</h3>
            <p className="text-gray-400">
              Support for various puzzle types including 2x2, 3x3, 4x4, and more.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="space-y-4">
          {isSignedIn ? (
            <Link
              to="/timer"
              className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 will-change-transform"
            >
              Start Timing
            </Link>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-400 mb-4">
                Sign in to sync your solves across devices
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/login"
                  className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 will-change-transform"
                >
                   Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 will-change-transform"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/solves"
                className="text-gray-400 hover:text-white transition-colors duration-200 will-change-transform"
              >
                View Solves
              </Link>
              <span className="text-gray-600 hidden sm:inline">•</span>
              <Link
                to="/timer"
                className="text-gray-400 hover:text-white transition-colors duration-200 will-change-transform"
              >
                Timer
              </Link>
            </div>
          </div>
      </div>
    </div>
  );
};

export default WelcomePage; 