import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SolveState = 'none' | '+2' | 'DNF';

export interface Solve {
  id: string;
  time: number; // milliseconds
  scramble: string;
  date: string; // ISO string
  puzzleType: string; // e.g., '333', '444', '555', etc.
  state: SolveState; // 'none', '+2', or 'DNF'
}

interface SolvesState {
  solves: Solve[];
}

const LOCAL_STORAGE_KEY = 'cube_solves';

const loadSolves = (): Solve[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveSolves = (solves: Solve[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(solves));
};

const initialState: SolvesState = {
  solves: loadSolves(),
};

const solvesSlice = createSlice({
  name: 'solves',
  initialState,
  reducers: {
    addSolve: (state, action: PayloadAction<Solve>) => {
      state.solves.unshift(action.payload);
      saveSolves(state.solves);
    },
    updateSolveState: (
      state,
      action: PayloadAction<{ id: string; state: SolveState }>,
    ) => {
      const solve = state.solves.find((s) => s.id === action.payload.id);
      if (solve) {
        solve.state = action.payload.state;
        saveSolves(state.solves);
      }
    },
    deleteSolve: (state, action: PayloadAction<string>) => {
      state.solves = state.solves.filter(
        (solve) => solve.id !== action.payload,
      );
      saveSolves(state.solves);
    },
    clearSolves: (state) => {
      state.solves = [];
      saveSolves([]);
    },
    loadFromStorage: (state) => {
      state.solves = loadSolves();
    },
  },
});

export const {
  addSolve,
  updateSolveState,
  deleteSolve,
  clearSolves,
  loadFromStorage,
} = solvesSlice.actions;
export default solvesSlice.reducer;
