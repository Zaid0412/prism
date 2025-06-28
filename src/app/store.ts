import { configureStore } from '@reduxjs/toolkit';
import timerReducer from '../features/timer/timerSlice';
import solvesReducer from '../features/solves/solvesSlice';

export const store = configureStore({
  reducer: {
    timer: timerReducer,
    solves: solvesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
