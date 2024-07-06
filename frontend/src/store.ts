import { configureStore } from '@reduxjs/toolkit'
import searchReducer, { TSliceType } from './state/searchSlice'
import sortingReducer, { TSortingSlice } from './state/sortingSlice'
import userReducer, { TUserSlice } from './state/userSlice'

interface RootState {
  user: TUserSlice,
  search: TSliceType,
  sorting: TSortingSlice,
}

export default configureStore({
  reducer: {
    search: searchReducer,
    sorting: sortingReducer,
    user: userReducer
  },
})

export type { RootState };