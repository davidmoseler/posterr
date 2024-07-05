import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ContainerProvider } from '../dependencyContainer';
import Widgets from '../components/Widgets';

let search: Function;
let sortByLatest: Function;
let sortByTrending: Function;
let dependencyContainer: {
  registry: any;
  resolve: Function;
};

beforeEach(() => {
  search = jest.fn();
  sortByLatest = jest.fn();
  sortByTrending = jest.fn();
  dependencyContainer = {
    registry: {
      Widgets: () => ({ search, sortByLatest, sortByTrending }),
    },
    resolve(identifier: string) {
      return this.registry[identifier];
    },
  };

  render(
    <ContainerProvider container={dependencyContainer}>
      <Widgets></Widgets>
    </ContainerProvider>
  );
});

describe('loads and displays widgets', () => {
  test('can search', async () => {
    const input = screen.getByPlaceholderText('Search');
    userEvent.type(input, 'Whatever{Enter}');

    expect(search).toHaveBeenCalledWith('Whatever');
  });

  test('can sort by latest', async () => {
    await userEvent.click(screen.getByText('Latest'));

    expect(sortByLatest).toHaveBeenCalled();
  });

  test('can sort by trending', async () => {
    await userEvent.click(screen.getByText('Trending'));

    expect(sortByTrending).toHaveBeenCalled();
  });
});
