import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ContainerProvider } from '../dependencyContainer';
import PostBuilder from '../components/PostBuilder';

let createPost: Function;
let dependencyContainer: {
  registry: any;
  resolve: Function;
};

beforeEach(() => {
  createPost = jest.fn();

  const useCreatePost = (
    newPostContent: string,
    setNewPostContent: Function
  ) => {
    return () => createPost(newPostContent);
  };

  dependencyContainer = {
    registry: {
      PostBuilder: () => ({
        useCreatePost,
      }),
    },
    resolve(identifier: string) {
      return this.registry[identifier];
    },
  };

  render(
    <ContainerProvider container={dependencyContainer}>
      <PostBuilder></PostBuilder>
    </ContainerProvider>
  );
});

describe('loads and displays feed', () => {
  test('can create post', async () => {
    const input = screen.getByPlaceholderText('What is happening?!');
    userEvent.type(input, 'New Post{Enter}');

    expect(createPost).toHaveBeenCalledWith('New Post');
  });
});
