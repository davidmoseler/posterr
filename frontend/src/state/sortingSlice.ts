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

interface TSortingSlice {
  value: string
}

export const { sortByLatest, sortByTrending } = sortingSlice.actions
export type { TSortingSlice };

export default sortingSlice.reducer