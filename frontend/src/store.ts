import { configureStore } from '@reduxjs/toolkit'
import searchReducer from './state/searchSlice'
import sortingReducer from './state/sortingSlice'

export default configureStore({
  reducer: {
    search: searchReducer,
    sorting: sortingReducer
  },
})