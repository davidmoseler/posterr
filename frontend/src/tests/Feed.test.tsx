import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ContainerProvider } from '../dependencyContainer';
import { InfiniteData } from '@tanstack/react-query';
import Feed from '../components/Feed';
import postType from '../types/post';
import userType from '../types/user';

let users: userType[];
let repost: Function;
let data: { pages: { data: postType[] }[] };
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
            datetime: 'now',
            is_repost: false,
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
        useCreatePost,
      }),
      Post: () => ({
        users,
        repost
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