import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [
      { id: '1', name: 'You' },
      { id: '2', name: 'John Doe' },
      { id: '3', name: 'Robert Denzer' },
      { id: '4', name: 'Sheila Doe' },
    ],
    currentUser: {
      id: "1",
    }
  },
  reducers: {
    setUser: (state, action) => {
      state.currentUser.id = action.payload
    },
  },
})

export const { setUser } = userSlice.actions

export default userSlice.reducer