import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import {
  calculateAoN,
  calculatePB,
  calculatePW,
  calculateCurrentAverage,
  formatTime,
  getSolvesForPuzzleType,
} from '../utils/statsUtils';
import { StatsDetailModal } from './StatsDetailModal';
import { SolveModal } from '../../solves/components/SolveModal';
import { deleteSolve, updateSolve, updateSolveLocal, deleteSolveLocal } from '../../solves/solvesSlice';
import { useUser } from '@clerk/clerk-react';

interface StatsProps {
  puzzleType: string;
}

const statConfigs = [
  {
    key: 'pb',
    label: 'PB',
    getValue: (solves: any[]) => calculatePB(solves),
    getSolves: (solves: any[]) => {
      const pb = calculatePB(solves);
      return solves.filter(s => s.time === pb);
    },
    isSingle: true,
  },
  {
    key: 'pw',
    label: 'PW',
    getValue: (solves: any[]) => calculatePW(solves),
    getSolves: (solves: any[]) => {
      const pw = calculatePW(solves);
      return solves.filter(s => s.time === pw);
    },
    isSingle: true,
  },
  {
    key: 'ao5',
    label: 'Ao5',
    getValue: (solves: any[]) => calculateAoN(solves, 5),
    getSolves: (solves: any[]) =>
      [...solves]
        .sort((a, b) => a.createdAt - b.createdAt)
        .slice(0, 5),
    isSingle: false,
  },
  {
    key: 'ao12',
    label: 'Ao12',
    getValue: (solves: any[]) => calculateAoN(solves, 12),
    getSolves: (solves: any[]) =>
      [...solves]
        .sort((a, b) => a.createdAt - b.createdAt)
        .slice(0, 12),
    isSingle: false,
  },
  {
    key: 'currentAvg',
    label: 'Current Average',
    getValue: (solves: any[]) => calculateCurrentAverage(solves),
    getSolves: (solves: any[]) => solves,
    isSingle: false,
  },
];

export const Stats: React.FC<StatsProps> = ({ puzzleType }) => {
  const solves = useAppSelector((state) => state.solves.solves);
  const puzzleSolves = getSolvesForPuzzleType(solves, puzzleType);
  const dispatch = useAppDispatch();
  const { isSignedIn } = useUser();

  const [modalStat, setModalStat] = useState<null | string>(null);
  const [selectedSolve, setSelectedSolve] = useState<any | null>(null);
  const [aoNPBSolves, setAoNPBSolves] = useState<any[] | null>(null);
  const [aoNPBValue, setAoNPBValue] = useState<number | null>(null);
  const [aoNPBType, setAoNPBType] = useState<'ao5' | 'ao12' | null>(null);

  const openModal = (key: string) => {
    const stat = statConfigs.find((s) => s.key === key);
    if (stat?.isSingle) {
      const solveArr = stat.getSolves(puzzleSolves);
      if (solveArr.length > 0) {
        setSelectedSolve(solveArr[0]);
      }
    } else {
      setModalStat(key);
    }
  };
  // Only close SolveModal when its close button is clicked
  const closeSolveModal = () => setSelectedSolve(null);
  // Only close StatsDetailModal when its close button is clicked
  const closeStatsModal = () => setModalStat(null);

  // Handlers for SolveModal actions
  const handleDelete = (solveId: string) => {
    dispatch(deleteSolveLocal(solveId)); // Optimistic UI
    if (isSignedIn) {
      dispatch(deleteSolve(solveId));
    }
    setSelectedSolve(null);
  };

  const handlePlus2 = (solve: any) => {
    const newState = solve.state === '+2' ? 'none' : '+2';
    dispatch(updateSolveLocal({ id: solve.id, solve: { state: newState } })); // Optimistic UI
    if (isSignedIn) {
      dispatch(updateSolve({ id: solve.id, solve: { state: newState } }));
    }
  };

  const handleDNF = (solve: any) => {
    const newState = solve.state === 'DNF' ? 'none' : 'DNF';
    dispatch(updateSolveLocal({ id: solve.id, solve: { state: newState } })); // Optimistic UI
    if (isSignedIn) {
      dispatch(updateSolve({ id: solve.id, solve: { state: newState } }));
    }
  };

  // Find the latest solve from Redux by id
  const liveSolve = selectedSolve
    ? solves.find(s => s.id === selectedSolve.id)
    : null;

  return (
    <div className='bg-gray-800 rounded-lg p-4 pt-8 w-96 h-86'>
      <div className='grid grid-cols-2 grid-rows-3 gap-4'>
        {/* Ao5 */}
        <div className='text-center rounded p-2 transition-colors row-start-1 col-start-1'>
          <div className='text-sm text-gray-400'>{statConfigs[2].label}</div>
          {formatTime(statConfigs[2].getValue(puzzleSolves)) !== '--' ? (
            <span
              className='text-xl font-mono cursor-pointer hover:underline'
              onClick={() => openModal(statConfigs[2].key)}
            >
              {formatTime(statConfigs[2].getValue(puzzleSolves))}
            </span>
          ) : (
            <span className='text-xl font-mono text-gray-500 cursor-not-allowed opacity-50'>
              {formatTime(statConfigs[2].getValue(puzzleSolves))}
            </span>
          )}
        </div>
        {/* Ao12 */}
        <div className='text-center rounded p-2 transition-colors row-start-1 col-start-2'>
          <div className='text-sm text-gray-400'>{statConfigs[3].label}</div>
          {formatTime(statConfigs[3].getValue(puzzleSolves)) !== '--' ? (
            <span
              className='text-xl font-mono cursor-pointer hover:underline'
              onClick={() => openModal(statConfigs[3].key)}
            >
              {formatTime(statConfigs[3].getValue(puzzleSolves))}
            </span>
          ) : (
            <span className='text-xl font-mono text-gray-500 cursor-not-allowed opacity-50'>
              {formatTime(statConfigs[3].getValue(puzzleSolves))}
            </span>
          )}
        </div>
        {/* Ao5 PB */}
        <div className='text-center rounded p-2 transition-colors row-start-2 col-start-1'>
          <div className='text-sm text-gray-400'>Ao5 PB</div>
          {(() => {
            const ao5s = [];
            const sorted = [...puzzleSolves].sort((a, b) => a.createdAt - b.createdAt);
            let pbChunk: any[] | null = null;
            let pbValue: number | null = null;
            for (let i = 0; i <= sorted.length - 5; i++) {
              const chunk = sorted.slice(i, i + 5);
              const val = calculateAoN(chunk, 5);
              if (val !== null) ao5s.push({ val, chunk });
            }
            if (ao5s.length > 0) {
              const pbObj = ao5s.reduce((min, curr) => curr.val < min.val ? curr : min, ao5s[0]);
              pbChunk = pbObj.chunk;
              pbValue = pbObj.val;
              return (
                <span
                  className='text-xl font-mono cursor-pointer hover:underline'
                  onClick={() => {
                    setModalStat('ao5');
                    setAoNPBSolves(pbChunk);
                    setAoNPBValue(pbValue);
                    setAoNPBType('ao5');
                  }}
                >
                  {formatTime(pbObj.val)}
                </span>
              );
            } else {
              return <span className='text-xl font-mono text-gray-500 cursor-not-allowed opacity-50'>--</span>;
            }
          })()}
        </div>
        {/* Ao12 PB */}
        <div className='text-center rounded p-2 transition-colors row-start-2 col-start-2'>
          <div className='text-sm text-gray-400'>Ao12 PB</div>
          {(() => {
            const ao12s = [];
            const sorted = [...puzzleSolves].sort((a, b) => a.createdAt - b.createdAt);
            let pbChunk: any[] | null = null;
            let pbValue: number | null = null;
            for (let i = 0; i <= sorted.length - 12; i++) {
              const chunk = sorted.slice(i, i + 12);
              const val = calculateAoN(chunk, 12);
              if (val !== null) ao12s.push({ val, chunk });
            }
            if (ao12s.length > 0) {
              const pbObj = ao12s.reduce((min, curr) => curr.val < min.val ? curr : min, ao12s[0]);
              pbChunk = pbObj.chunk;
              pbValue = pbObj.val;
              return (
                <span
                  className='text-xl font-mono cursor-pointer hover:underline'
                  onClick={() => {
                    setModalStat('ao12');
                    setAoNPBSolves(pbChunk);
                    setAoNPBValue(pbValue);
                    setAoNPBType('ao12');
                  }}
                >
                  {formatTime(pbObj.val)}
                </span>
              );
            } else {
              return <span className='text-xl font-mono text-gray-500 cursor-not-allowed opacity-50'>--</span>;
            }
          })()}
        </div>
        {/* Centered PB (spanning both columns in row 3) */}
        <div className='col-span-2 row-start-3 flex flex-col items-center justify-center bg-gray-900 border border-gray-700 rounded-full px-6 py-2 shadow-lg'>
          <div className='text-xs text-gray-400'>{statConfigs[0].label}</div>
          {formatTime(statConfigs[0].getValue(puzzleSolves)) !== '--' ? (
            <span
              className='text-2xl mb-2 font-bold text-indigo-300 cursor-pointer hover:underline'
              onClick={() => openModal(statConfigs[0].key)}
            >
              {formatTime(statConfigs[0].getValue(puzzleSolves))}
            </span>
          ) : (
            <span className='text-2xl mb-2 font-bold text-gray-500 cursor-not-allowed opacity-50'>
              {formatTime(statConfigs[0].getValue(puzzleSolves))}
            </span>
          )}
        </div>
      </div>
      <div className='text-center mt-3 text-sm text-gray-500'>
        {puzzleSolves.length} solves
      </div>
      {modalStat && (() => {
        const currentStatConfig = statConfigs.find((s) => s.key === modalStat);
        let currentStatSolves = currentStatConfig ? currentStatConfig.getSolves(puzzleSolves) : [];
        let title = currentStatConfig?.label || '';
        let value = formatTime(currentStatConfig?.getValue(puzzleSolves) || 0);
        // Helper to format puzzle type
        const formatPuzzleType = (type: string) => {
          const map: Record<string, string> = {
            '222': '2x2',
            '333': '3x3',
            '444': '4x4',
            '555': '5x5',
            '666': '6x6',
            '777': '7x7',
            pyram: 'pyram',
            skewb: 'skewb',
            sq1: 'square-1',
            clock: 'clock',
            minx: 'megaminx',
          };
          return map[type] || type;
        };
        if ((modalStat === 'ao5' || modalStat === 'ao12') && aoNPBSolves && aoNPBValue !== null && aoNPBType) {
          currentStatSolves = aoNPBSolves;
          title = `Best ${formatPuzzleType(puzzleType)} Average of ${aoNPBType === 'ao5' ? '5' : '12'}`;
          value = formatTime(aoNPBValue);
        } else if (modalStat === 'ao5' || modalStat === 'ao12') {
          title = `${formatPuzzleType(puzzleType)} Average of ${modalStat === 'ao5' ? '5' : '12'}`;
        }
        return (
          <StatsDetailModal
            open={!!modalStat}
            onClose={() => {
              closeStatsModal();
              setAoNPBSolves(null);
              setAoNPBValue(null);
              setAoNPBType(null);
            }}
            title={title}
            value={value}
            solves={currentStatSolves}
            statKey={modalStat}
            puzzleType={puzzleType}
            onSolveClick={(solve) => setSelectedSolve(solve)}
            onDeleteSolve={handleDelete}
          />
        );
      })()}
      {selectedSolve && liveSolve && (
        <SolveModal
          solve={liveSolve}
          isOpen={!!selectedSolve}
          onClose={closeSolveModal}
          onDelete={() => handleDelete(liveSolve.id)}
          onPlus2={() => handlePlus2(liveSolve)}
          onDNF={() => handleDNF(liveSolve)}
        />
      )}
    </div>
  );
};
