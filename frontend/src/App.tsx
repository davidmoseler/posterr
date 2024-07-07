import React from 'react';
import {
  QueryClient,
  QueryCache,
  QueryClientProvider,
} from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import Widgets from './components/Widgets';
import { ContainerProvider, dependencyContainer } from './dependencyContainer';
import { onError } from './repositories/fetchWrapper';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError,
  }),
});

const App = () => {
  return (
    <ContainerProvider container={dependencyContainer}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Toaster></Toaster>
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
