import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Timer from '../../timer/components/Timer';
import SolvesList from '../../solves/components/SolvesList';
import { Sidebar } from '../../sidebar/components/Sidebar';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [puzzleType, setPuzzleType] = useState('333');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className='min-h-screen bg-gray-900 text-white flex'>
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          puzzleType={puzzleType}
          setPuzzleType={setPuzzleType}
        />

        {/* Main content */}
        <div
          className={`flex-1 transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'ml-64' : 'ml-16'
          }`}
        >
          <div className='flex flex-col items-center justify-center min-h-screen'>
            <Routes>
              <Route path='/' element={<Timer puzzleType={puzzleType} />} />
              <Route path='/solves' element={<SolvesList />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
