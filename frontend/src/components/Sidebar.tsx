import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setUser } from '../state/userSlice';
import user from '../types/user';

const Sidebar = () => {
  const dispatch = useDispatch();

  const users = useSelector((state: any) => state.user.users);
  const currentUser = useSelector((state: any) => state.user.currentUser);

  return (
    <div className="flex flex-col w-80 h-screen p-4 bg-white border-r border-gray-200">
      <div className="space-y-4"></div>
      {users.map((u:any) => (
        <button
          onClick={() => dispatch(setUser(u.id))}
          className={'p-2 rounded' + (u.id === currentUser.id ? ' font-bold' : '')}
        >
          {u.name}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
