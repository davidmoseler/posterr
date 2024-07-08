import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ContainerProvider } from '../dependencyContainer';
import { InfiniteData } from '@tanstack/react-query';
import Feed from '../components/Feed';
import TPost from '../types/post';
import TUser from '../types/user';

let users: TUser[];
let repost: Function;
let data: { pages: { data: TPost[] }[] };
let fetchNextPage: Function;
let hasNextPage: boolean;
let isFetching: boolean;
let isFetchingNextPage: boolean;
let createPost: Function;
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
  ];
  repost = jest.fn();
  data = {
    pages: [
      {
        data: [
          {
            post_id: '1',
            content: 'Hello',
            user_id: '1',
            created_at: 'now',
            repost: false,
            reposter_id: 'null',
          },
        ],
      },
    ],
  };
  fetchNextPage = jest.fn();
  hasNextPage = false;
  isFetching = false;
  isFetchingNextPage = false;
  createPost = jest.fn();

  const useCreatePost = (
    newPostContent: string,
    setNewPostContent: Function
  ) => {
    return () => createPost(newPostContent);
  };

  const intersectionObserverMock = () => ({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = jest
    .fn()
    .mockImplementation(intersectionObserverMock);

  dependencyContainer = {
    registry: {
      Feed: () => ({
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
      }),
      Post: () => ({
        users,
        repost
      }),
      PostBuilder: () => ({
        useCreatePost,
      })
    },
    resolve(identifier: string) {
      return this.registry[identifier];
    },
  };

  render(
    <ContainerProvider container={dependencyContainer}>
      <Feed></Feed>
    </ContainerProvider>
  );
});

describe('loads and displays feed', () => {
  test('can create post', async () => {
    const input = screen.getByPlaceholderText('What is happening?!');
    userEvent.type(input, 'New Post{Enter}');

    expect(createPost).toHaveBeenCalledWith('New Post');
  });

  test('posts are listed', async () => {
    expect(await screen.findByText('Hello')).toBeVisible();
  });
});
