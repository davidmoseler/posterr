import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ContainerProvider } from '../dependencyContainer';
import Sidebar from '../components/Sidebar';
import TUser from '../types/user';

let users: TUser[];
let currentUser: string;
let setUser: Function;
let dependencyContainer: {
  registry: any;
  resolve: Function;
};

beforeEach(() => {
  users = [
    {
      id: '1',
      name: 'John Doe',
    },
    {
      id: '2',
      name: 'Barry Tone',
    },
  ];
  currentUser = '1';
  setUser = jest.fn();
  dependencyContainer = {
    registry: {
      Sidebar: () => ({ users, currentUser, setUser }),
    },
    resolve(identifier: string) {
      return this.registry[identifier];
    },
  };

  render(
    <ContainerProvider container={dependencyContainer}>
      <Sidebar />
    </ContainerProvider>
  );
});

describe('loads and displays sidebar', () => {
  test('has user names', async () => {
    expect(await screen.findByText('John Doe')).toBeVisible();
    expect(await screen.findByText('Barry Tone')).toBeVisible();
  });

  test('can switch the user', async () => {
    await userEvent.click(screen.getByText('Barry Tone'));

    expect(setUser).toHaveBeenCalledWith('2');
  });
});
