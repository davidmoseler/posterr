import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import { useQueryClient } from '@tanstack/react-query';
import { dependencyContainer, useDependencies } from '../dependencyContainer';
import Post from './Post';
import TPost from '../types/post';
import { useGetPosts, useCreatePost } from '../repositories/postRepository';
import { RootState } from '../store';
import useOnChange from '../hooks/useOnChange';
import PostBuilder from './PostBuilder';

dependencyContainer.register('Feed', () => {
  const queryClient = useQueryClient();

  const currentUser = useSelector(
    (state: RootState) => state.user.currentUser.id
  );
  const searchTerm = useSelector((state: RootState) => state.search.value);
  const sorting = useSelector((state: RootState) => state.sorting.value);

  const {
    data,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useGetPosts(currentUser, searchTerm, sorting);

  useOnChange(
    () => queryClient.resetQueries({ queryKey: ['posts'], exact: true }),
    { searchTerm, sorting }
  );

  return {
    data,
    isGettingPosts: isFetching,
    getPostsError: isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
});

const Feed = () => {
  const {
    data,
    isGettingPosts,
    getPostsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDependencies('Feed');

  const [ref, inView] = useInView();

  const mergePages = (pages: { data: TPost[] }[]) => {
    const posts: TPost[] = [];
    pages.forEach((p: { data: TPost[] }) => {
      p.data.forEach((post: TPost) => posts.push(post));
    });
    return posts;
  };

  const posts = data ? mergePages(data.pages) : [];

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-xl font-bold">Home</h2>
        <PostBuilder />
      </div>
      <div>
        {posts.map((post: TPost) => (
          <Post key={post.post_id} post={post} />
        ))}
      </div>
      <button
        ref={ref}
        disabled={!hasNextPage || isFetchingNextPage}
        onClick={() => fetchNextPage()}
      >
        {isFetchingNextPage
          ? 'Fetching next page'
          : hasNextPage
          ? 'Fetch More Data'
          : 'No more posts'}
      </button>
      {isGettingPosts ? (
        <p className="m-4 text-center">Loading posts...</p>
      ) : (
        <></>
      )}
      {getPostsError ? (
        <div className="m-4 text-center">
          <h2 className="font-bold">Couldn't get posts at this time</h2>
          <p>Please wait a few moments then try again</p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Feed;
