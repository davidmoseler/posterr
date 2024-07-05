import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { dependencyContainer, useDependencies } from '../dependencyContainer';
import Post from './Post';
import postType from '../types/post';
import { useGetPosts, useCreatePost } from '../repositories/postRepository';

dependencyContainer.register('Feed', () => {
  const queryClient = useQueryClient();

  const currentUser = useSelector((state: any) => state.user.currentUser.id);
  const searchTerm = useSelector((state: any) => state.search.value);
  const sorting = useSelector((state: any) => state.sorting.value);

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ['posts'], exact: true });
  }, [searchTerm, sorting]);

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useGetPosts(currentUser, searchTerm, sorting);

  const useCreatePostWrapper = (
    newPostContent: string,
    setNewPostContent: Function
  ) => {
    return useCreatePost(currentUser, newPostContent, () =>
      setNewPostContent('')
    );
  };

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    useCreatePost: useCreatePostWrapper,
  };
});

const Feed = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    useCreatePost,
  } = useDependencies('Feed');

  const [ref, inView] = useInView();
  const [newPostContent, setNewPostContent] = useState<string>('');
  const createPost = useCreatePost(newPostContent, setNewPostContent);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      createPost();
    }
  };

  const mergePages = (pages: any) => {
    const posts: any = [];
    pages.forEach((p: any) => {
      p.data.forEach((post: postType) => posts.push(post));
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
        <div className="h-24 w-full border-b px-10 py-8">
          <textarea
            className="h-7 w-full border-0 overflow-auto outline-none resize-none"
            placeholder="What is happening?!"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            onKeyDown={handleKeyPress}
          ></textarea>
        </div>
        <div className="h-9 w-full p-2 flex justify-end">
          <button
            className={
              (newPostContent.length ? 'bg-blue-400' : 'bg-blue-200') +
              ' text-white w-16 h-9 rounded-3xl'
            }
            onClick={() => {
              createPost();
            }}
          >
            Post
          </button>
        </div>
      </div>
      <div>
        {posts.map((post: postType) => (
          <Post post={post} />
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
    </div>
  );
};

export default Feed;
