import { createSlice } from '@reduxjs/toolkit'

export const searchSlice = createSlice({
  name: 'search',
  initialState: {
    value: "",
  },
  reducers: {
    search: (state, action) => {
      state.value = action.payload
    },
  },
})

interface searchSliceType {
  value: string
}

export const { search } = searchSlice.actions
export type { searchSliceType };

export default searchSlice.reducer