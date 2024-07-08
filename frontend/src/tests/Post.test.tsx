import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ContainerProvider } from '../dependencyContainer';
import Post from '../components/Post';
import TPost from '../types/post';
import TUser from '../types/user';

let users: TUser[];
let post: TPost;
let repost: Function;
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
  post = {
    post_id: '1',
    content: 'Hello',
    user_id: '1',
    created_at: 'now',
    is_repost: false,
    reposter_id: 'null',
  };
  repost = jest.fn();

  dependencyContainer = {
    registry: {
      Post: (post: TPost) => ({ users, repost }),
    },
    resolve(identifier: string) {
      return this.registry[identifier];
    },
  };

  render(
    <ContainerProvider container={dependencyContainer}>
      <Post post={post} />
    </ContainerProvider>
  );
});

describe('loads and displays post', () => {
  test('has post content', async () => {
    expect(await screen.findByText('Hello')).toBeVisible();
  });

  test('has post author', async () => {
    expect(await screen.findByText('John Doe')).toBeVisible();
  });

  test('is able to repost', async () => {
    expect(await screen.findByTestId('repost')).toBeVisible();

    await userEvent.click(screen.getByTestId('repost'));

    expect(repost).toHaveBeenCalled();
  });

  test('reposts are shown as reposts', async () => {
    post = {
      ...post,
      is_repost: true,
      reposter_id: '1',
    };

    render(
      <ContainerProvider container={dependencyContainer}>
        <Post post={post} />
      </ContainerProvider>
    );

    expect(await screen.findByText('John Doe reposted')).toBeVisible();
  });
});
