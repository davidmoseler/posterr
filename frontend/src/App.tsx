import React from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import Widgets from './components/Widgets';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex">
        <div className="flex flex-col">
          <Navbar />
          <Sidebar />
        </div>
        <Feed />
        <Widgets />
      </div>
    </div>
  );
};

export default App;