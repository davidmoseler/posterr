import { configureStore } from '@reduxjs/toolkit'
import searchReducer from './state/searchSlice'
import sortingReducer from './state/sortingSlice'
import userReducer from './state/userSlice'

export default configureStore({
  reducer: {
    search: searchReducer,
    sorting: sortingReducer,
    user: userReducer
  },
})