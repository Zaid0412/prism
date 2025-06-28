import { createSlice } from '@reduxjs/toolkit';

interface TimerState {
  running: boolean;
  startTime: number | null;
  elapsed: number;
}

const initialState: TimerState = {
  running: false,
  startTime: null,
  elapsed: 0,
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    start(state) {
      state.running = true;
      state.startTime = Date.now();
    },
    stop(state) {
      if (state.running && state.startTime) {
        state.elapsed = Date.now() - state.startTime;
        state.running = false;
        state.startTime = null;
      }
    },
    reset(state) {
      state.running = false;
      state.startTime = null;
      state.elapsed = 0;
    },
  },
});

export const { start, stop, reset } = timerSlice.actions;
export default timerSlice.reducer;
