import React from 'react';
import user from '../types/user';

const Sidebar = ({
  users,
  currentUser,
  setCurrentUser,
}: {
  users: user[];
  currentUser: user;
  setCurrentUser: Function;
}) => {
  return (
    <div className="flex flex-col w-80 h-screen p-4 bg-white border-r border-gray-200">
      <div className="space-y-4"></div>
      {users.map((u) => (
        <button
          onClick={() => setCurrentUser(u)}
          className={'p-2 rounded' + (u.id === currentUser.id ? ' font-bold' : '')}
        >
          {u.name}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
