import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { dependencyContainer, useDependencies } from '../dependencyContainer';
import { setUser } from '../state/userSlice';
import { RootState } from '../store';
import TUser from '../types/user';

dependencyContainer.register('Sidebar', () => {
  const dispatch = useDispatch();

  const users = useSelector((state: RootState) => state.user.users);
  const currentUser = useSelector(
    (state: RootState) => state.user.currentUser.id
  );

  return {
    users,
    currentUser,
    setUser: (userId: 'string') => dispatch(setUser(userId)),
  };
});

const Sidebar = () => {
  const { users, currentUser, setUser } = useDependencies('Sidebar');

  return (
    <div className="flex flex-col w-80 h-screen p-4 bg-white border-r border-gray-200">
      <div className="space-y-4"></div>
      {users.map((u: TUser) => (
        <button
          key={u.id}
          onClick={() => setUser(u.id)}
          className={
            'text-left my-1 p-2 rounded' +
            (u.id === currentUser ? ' font-bold' : '')
          }
        >
          {u.name}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
