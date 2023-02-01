import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: {},
}

export const counterSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    decrement: (state) => {
      state.value -= 1
    },
    incrementTab: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { incrementTab } = counterSlice.actions

export default counterSlice.reducer