import { createSlice } from '@reduxjs/toolkit'

export const sortingSlice = createSlice({
  name: 'sorting',
  initialState: {
    value: "latest",
  },
  reducers: {
    sortByLatest: (state) => {
      state.value = "latest"
    },
    sortByTrending: (state) => {
      state.value = "trending"
    }
  },
})

export const { sortByLatest, sortByTrending } = sortingSlice.actions

export default sortingSlice.reducer