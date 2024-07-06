import { createSlice } from '@reduxjs/toolkit';
import TUser from '../types/user';

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

interface userSliceType {
  users: TUser[],
  currentUser: {
    id: string
  }
}

export const { setUser } = userSlice.actions;
export type { userSliceType };

export default userSlice.reducer;