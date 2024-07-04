import React, { useState } from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import Post from './Post';
import user from '../types/user';
import post from '../types/post';

async function getPosts(user_id: string) {
  const response = await fetch(
    'http://localhost:5000/post/get_posts?page=1&user_id=' + user_id,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.json();
}

const Feed = ({ users, currentUser }: { users: user[]; currentUser: user }) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts(currentUser.id),
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
      refetch();
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
    const user = users.find((u) => u.id == user_id);
    return user ? user.name : '';
  };

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
        {data?.map((post: post) => (
          <Post author={getUserName(post.user_id)} content={post.content} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
