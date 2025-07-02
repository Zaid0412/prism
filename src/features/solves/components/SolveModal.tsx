import React, { useEffect, useRef, useState } from 'react';
import { FaRegCopy, FaShareAlt } from 'react-icons/fa'
import { PiCubeBold } from 'react-icons/pi';
import { useUser } from '@clerk/clerk-react';

interface SolveModalProps {
  solve: {
    id: string;
    time: number;
    scramble: string;
    puzzleType: string;
    state: 'none' | '+2' | 'DNF';
    timestamp: number;
    createdAt: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onPlus2?: () => void;
  onDNF?: () => void;
}

const formatTime = (ms: number, state: 'none' | '+2' | 'DNF') => {
  if (state === 'DNF') {
    return 'DNF';
  }
  const time = state === '+2' ? ms + 2000 : ms;
  return `${(time / 1000).toFixed(2)}s`;
};

const formatPuzzleType = (puzzleType: string) => {
  const puzzleMap: { [key: string]: string } = {
    '222': '2x2',
    '333': '3x3',
    '444': '4x4',
    '555': '5x5',
    '666': '6x6',
    '777': '7x7',
    pyram: 'Pyram',
    skewb: 'Skewb',
    sq1: 'Square-1',
    clock: 'Clock',
    minx: 'Megaminx',
  };
  return puzzleMap[puzzleType] || puzzleType;
};

const getEventId = (puzzleType: string) => {
  const eventMap: { [key: string]: string } = {
    '222': '222',
    '333': '333',
    '444': '444',
    '555': '555',
    '666': '666',
    '777': '777',
    pyram: 'pyram',
    skewb: 'skewb',
    sq1: 'sq1',
    clock: 'clock',
    minx: 'minx',
  };
  return eventMap[puzzleType] || '333';
};

export const SolveModal: React.FC<SolveModalProps> = ({
  solve,
  isOpen,
  onClose,
  onDelete,
  onEdit,
  onPlus2,
  onDNF,
}) => {
  const scrambleRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<'scramble' | 'notes'>('scramble');
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (isOpen && scrambleRef.current && tab === 'scramble') {
      scrambleRef.current.innerHTML = '';
      const scrambleElement = document.createElement('scramble-display');
      scrambleElement.setAttribute('scramble', solve.scramble);
      scrambleElement.setAttribute('event', getEventId(solve.puzzleType));
      scrambleElement.setAttribute('visualization', '2D');
      scrambleElement.style.width = '300px';
      scrambleElement.style.height = '200px';
      scrambleRef.current.appendChild(scrambleElement);
    }
  }, [isOpen, solve.scramble, solve.puzzleType, tab]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-gray-900 rounded-lg p-0 max-w-xl w-full mx-4 shadow-lg border border-gray-700'>
        {/* Header */}
        <div className='flex justify-between items-center px-6 pt-6 pb-2'>
          <button
            onClick={() => {
              const shareUrl = `${window.location.origin}/solve/${solve.id}`;
              navigator.clipboard.writeText(shareUrl);
              setShareCopied(true);
              setTimeout(() => setShareCopied(false), 1200);
            }}
            className='flex items-center gap-2 border border-gray-700 hover:bg-gray-800 text-gray-200 px-3 py-1 rounded shadow-sm text-sm font-medium focus:outline-none'
          >
            <FaShareAlt /> Share Link
            {shareCopied && (
              <span className='ml-2 text-green-400'>Copied!</span>
            )}
          </button>
          <div className='flex items-center gap-2'>
            <button
              onClick={onDelete}
              className='bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1 rounded text-sm font-medium focus:outline-none'
            >
              Delete
            </button>
            <button
              onClick={onEdit}
              className='bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1 rounded text-sm font-medium focus:outline-none'
            >
              Edit
            </button>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-200 text-2xl font-bold ml-2'
            >
              ×
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className='flex flex-col items-center px-6 pt-2 pb-6'>
          {/* Time */}
          <div className='text-6xl font-bold text-white mt-2 mb-4'>
            {formatTime(solve.time, solve.state)}
          </div>
          {/* User Info */}
          <div className='flex items-center justify-center mb-3'>
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt='User avatar'
                className='w-7 h-7 rounded-full mr-2 border-2 border-gray-700'
              />
            ) : (
              <div className='w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-2 border-2 border-gray-600'>
                <svg
                  className='w-6 h-6 text-gray-400'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z' />
                </svg>
              </div>
            )}
            <span className='text-gray-200 font-medium'>
              {user?.username ||
                user?.primaryEmailAddress?.emailAddress ||
                'User'}
            </span>
          </div>
          {/* Puzzle Type & Date */}
          <div className='flex flex-col items-center mb-2'>
            <div className='flex items-center gap-2 mb-2'>
              <span className='bg-gray-700 text-gray-200 px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 tracking-wider'>
                {formatPuzzleType(solve.puzzleType)} <PiCubeBold />
              </span>
              <button
                onClick={onPlus2}
                className={`px-3 py-1 rounded text-xs font-semibold focus:outline-none transition-colors
                  ${
                    solve.state === '+2'
                      ? 'bg-yellow-400 text-yellow-900'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  }`}
              >
                +2
              </button>
              <button
                onClick={onDNF}
                className={`px-3 py-1 rounded text-xs font-semibold focus:outline-none transition-colors
                  ${
                    solve.state === 'DNF'
                      ? 'bg-red-400 text-red-900'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  }`}
              >
                DNF
              </button>
            </div>
            <span className='text-xs text-gray-400'>
              {new Date(solve.createdAt).toLocaleString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
            </span>
          </div>
          <hr className='w-full border-gray-700 my-4' />

          {/* Tabs */}
          <div className='flex mb-4 w-full'>
            <button
              className={`flex-1 py-2 rounded-t-lg font-semibold text-sm transition-all ${
                tab === 'scramble'
                  ? 'bg-blue-700 text-white shadow'
                  : 'bg-gray-800 text-gray-300'
              }`}
              onClick={() => setTab('scramble')}
            >
              Scramble
            </button>
            <button
              className={`flex-1 py-2 rounded-t-lg font-semibold text-sm transition-all ml-2 ${
                tab === 'notes'
                  ? 'bg-gray-700 text-gray-200 shadow'
                  : 'bg-gray-800 text-gray-400'
              }`}
              onClick={() => setTab('notes')}
            >
              Notes
            </button>
          </div>

          {/* Tab Content */}
          {tab === 'scramble' && (
            <>
              {/* Scramble Visualization */}
              <div className='flex justify-center mb-2'>
                <div ref={scrambleRef} className='p-2 rounded' />
              </div>
              {/* Scramble Text */}
              <div className='p-3 rounded text-base font-mono text-gray-200 break-all mb-2 text-center'>
                {solve.scramble}
              </div>
              {/* Copy Scramble Button */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(solve.scramble);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1200);
                }}
                className='flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-200 py-2 px-6 rounded text-sm font-medium transition-colors mx-auto'
              >
                <FaRegCopy /> Copy Scramble
                {copied && <span className='ml-2 text-green-400'>Copied!</span>}
              </button>
            </>
          )}
          {tab === 'notes' && (
            <div className='w-full text-center text-gray-400 py-8'>
              Notes feature coming soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
