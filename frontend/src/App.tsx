import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import store from './store';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import Widgets from './components/Widgets';
import user from './types/user';
import { ContainerProvider, dependencyContainer } from './dependencyContainer';

const queryClient = new QueryClient();

const App = () => {
  return (
    <ContainerProvider container={dependencyContainer}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
      </Provider>
    </ContainerProvider>
  );
};

export default App;
