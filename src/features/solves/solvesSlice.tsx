// src/features/solves/solvesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient, Solve } from '../../services/api';

// Async thunks for API calls
export const fetchSolves = createAsyncThunk('solves/fetchSolves', async () => {
  try {
    return await apiClient.getSolves();
  } catch (error) {
    console.error('Failed to fetch solves:', error);
    return [];
  }
});

export const createSolve = createAsyncThunk(
  'solves/createSolve',
  async (solve: Omit<Solve, 'id'>) => {
    try {
      return await apiClient.createSolve(solve);
    } catch (error) {
      console.error('Failed to create solve:', error);
      // Fallback to local storage
      const localSolve = { ...solve, id: Date.now().toString() };
      return localSolve;
    }
  },
);

export const updateSolve = createAsyncThunk(
  'solves/updateSolve',
  async ({ id, solve }: { id: string; solve: Partial<Solve> }) => {
    try {
      return await apiClient.updateSolve(id, solve);
    } catch (error) {
      console.error('Failed to update solve:', error);
      throw error;
    }
  },
);

export const deleteSolve = createAsyncThunk(
  'solves/deleteSolve',
  async (id: string) => {
    try {
      await apiClient.deleteSolve(id);
      return id;
    } catch (error) {
      console.error('Failed to delete solve:', error);
      throw error;
    }
  },
);

const solvesSlice = createSlice({
  name: 'solves',
  initialState: {
    solves: [] as Solve[],
    loading: false,
    error: null as string | null,
  },
  reducers: {
    addSolveLocal: (state, action: PayloadAction<Solve>) => {
      state.solves.push(action.payload);
      // Save to localStorage
      localStorage.setItem('solves', JSON.stringify(state.solves));
    },
    updateSolveLocal: (
      state,
      action: PayloadAction<{ id: string; solve: Partial<Solve> }>,
    ) => {
      const index = state.solves.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.solves[index] = {
          ...state.solves[index],
          ...action.payload.solve,
        };
        localStorage.setItem('solves', JSON.stringify(state.solves));
      }
    },
    deleteSolveLocal: (state, action: PayloadAction<string>) => {
      state.solves = state.solves.filter((s) => s.id !== action.payload);
      localStorage.setItem('solves', JSON.stringify(state.solves));
    },
    loadSolvesFromStorage: (state) => {
      const stored = localStorage.getItem('solves');
      if (stored) {
        state.solves = JSON.parse(stored);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSolves.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSolves.fulfilled, (state, action) => {
        state.loading = false;
        state.solves = action.payload;
      })
      .addCase(fetchSolves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch solves';
      })
      .addCase(createSolve.fulfilled, (state, action) => {
        state.solves.push(action.payload);
      })
      .addCase(updateSolve.fulfilled, (state, action) => {
        const index = state.solves.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.solves[index] = action.payload;
        }
      })
      .addCase(deleteSolve.fulfilled, (state, action) => {
        state.solves = state.solves.filter((s) => s.id !== action.payload);
      });
  },
});

export const {
  addSolveLocal,
  updateSolveLocal,
  deleteSolveLocal,
  loadSolvesFromStorage,
} = solvesSlice.actions;
export default solvesSlice.reducer;
