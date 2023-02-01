import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counter/counterSlice';
import tabsReducer from './tabs/tabSlice';
import companyReducer from './company/companySlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    company: companyReducer,
    tabs: tabsReducer,
  },
})