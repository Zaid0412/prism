import { createSlice} from '@reduxjs/toolkit';

interface TimerState {
  running: boolean;
  elapsed: number;
  startTime: number | null;
}

const initialState: TimerState = {
  running: false,
  elapsed: 0,
  startTime: null,
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    start: (state) => {
      state.running = true;
      state.startTime = Date.now();
    },
    stop: (state) => {
      state.running = false;
      if (state.startTime) {
        state.elapsed = Date.now() - state.startTime;
      }
      state.startTime = null;
    },
    reset: (state) => {
      state.running = false;
      state.elapsed = 0;
      state.startTime = null;
    },
  },
});

export const { start, stop, reset } = timerSlice.actions;
export default timerSlice.reducer;
