import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import {
  useInfiniteQuery,
  useQueryClient,
  useMutation,
} from '@tanstack/react-query';
import Post from './Post';
import user from '../types/user';
import post from '../types/post';

async function getPosts(
  user_id: string,
  page: number,
  searchTerm: string,
  sorting: string
) {
  const response = await fetch(
    'http://localhost:5000/post/get_posts?' +
      'page=' +
      page +
      '&user_id=' +
      user_id +
      '&search_term=' +
      searchTerm +
      '&sorting=' +
      sorting,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.json();
}

const Feed = () => {
  const [ref, inView] = useInView();
  const queryClient = useQueryClient();

  const users = useSelector((state: any) => state.user.users);
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const searchTerm = useSelector((state: any) => state.search.value);
  const sorting = useSelector((state: any) => state.sorting.value);

  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) =>
      getPosts(currentUser.id, pageParam, searchTerm, sorting),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    getPreviousPageParam: (firstPage) => firstPage.previousPage,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      fetch('http://localhost:5000/post/create_post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: currentUser.id,
          content: newPostContent,
        }),
      }),
    onSuccess: () => {
      setNewPostContent('');
      queryClient.resetQueries({ queryKey: ['posts'], exact: true });
    },
  });
  const [newPostContent, setNewPostContent] = useState<string>('');

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      mutate();
    }
  };

  const getUserName = (user_id: string) => {
    const user = users.find((u:any) => u.id == user_id);
    return user ? user.name : '';
  };

  const mergePages = (pages: any) => {
    const posts: any = [];
    pages.forEach((p: any) => {
      p.data.forEach((post: any) => posts.push(post));
    });
    return posts;
  };

  const posts = data ? mergePages(data.pages) : [];

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ['posts'], exact: true });
  }, [searchTerm, sorting]);

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-xl font-bold">Home</h2>
        <div className="h-24 w-full border-b px-10 py-8">
          <textarea
            className="h-7 w-full border-0 overflow-auto outline-none resize-none"
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
              mutate();
            }}
          >
            Post
          </button>
        </div>
      </div>
      <div>
        {posts.map((post: post) => (
          <Post author={getUserName(post.user_id)} content={post.content} />
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
