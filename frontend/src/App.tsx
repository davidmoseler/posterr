import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import Widgets from './components/Widgets';
import user from './types/user';

const queryClient = new QueryClient();

const App = () => {
  const users: user[] = [
    { id: '1', name: 'Me' },
    { id: '2', name: 'John Doe' },
    { id: '3', name: 'Robert Denzer' },
    { id: '4', name: 'Sheila Doe' },
  ];

  const [currentUser, setCurrentUser] = useState<user>(users[0]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <div className="flex">
          <div className="flex flex-col">
            <Navbar />
            <Sidebar
              users={users}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          </div>
          <Feed users={users} currentUser={currentUser} />
          <Widgets />
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default App;
