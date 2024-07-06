import { configureStore } from '@reduxjs/toolkit'
import searchReducer, { searchSliceType } from './state/searchSlice'
import sortingReducer, { sortingSliceType } from './state/sortingSlice'
import userReducer, { userSliceType } from './state/userSlice'

interface RootState {
  user: userSliceType,
  search: searchSliceType,
  sorting: sortingSliceType,
}

export default configureStore({
  reducer: {
    search: searchReducer,
    sorting: sortingReducer,
    user: userReducer
  },
})

export type { RootState };