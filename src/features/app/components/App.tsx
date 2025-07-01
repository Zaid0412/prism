import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Timer from '../../timer/components/Timer';
import SolvesList from '../../solves/components/SolvesList';
import { Sidebar } from '../../sidebar/components/Sidebar';
import { fetchSolves, loadSolvesFromStorage } from '../../solves/solvesSlice';
import AuthPage from '../../auth/components/AuthPage';
import { useUser } from '@clerk/clerk-react';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [puzzleType, setPuzzleType] = useState('333');
  const dispatch = useDispatch();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      dispatch(fetchSolves() as any)
        .unwrap()
        .catch(() => {
          dispatch(loadSolvesFromStorage());
        });
    } else {
      dispatch(loadSolvesFromStorage());
    }
  }, [dispatch, isSignedIn, isLoaded]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!isLoaded) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-900 text-white'>
        <span className="inline-block w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" role="status" aria-label="Loading" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path='/login' element={<AuthPage />} />
        <Route path='/signup' element={<AuthPage />} />
        <Route
          path='*'
          element={
            <>
              <div className='min-h-screen bg-gray-900 text-white flex'>
                <Sidebar
                  isOpen={sidebarOpen}
                  toggleSidebar={toggleSidebar}
                  puzzleType={puzzleType}
                  setPuzzleType={setPuzzleType}
                />
                <div
                  className={`flex-1 transition-all duration-300 ease-in-out ${
                    sidebarOpen ? 'ml-64' : 'ml-16'
                  }`}
                >
                  <div className='flex flex-col items-center justify-center min-h-screen'>
                    <Routes>
                      <Route
                        path='/'
                        element={<Timer puzzleType={puzzleType} />}
                      />
                      <Route path='/solves' element={<SolvesList />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
