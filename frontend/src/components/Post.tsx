import React from 'react';
import { useSelector } from 'react-redux';
import {
  useQueryClient,
  useMutation,
} from '@tanstack/react-query';
import post from '../types/post';

const Post = ({ post } : { post:post }) => {
  const queryClient = useQueryClient();

  const users = useSelector((state: any) => state.user.users);
  const currentUser = useSelector((state: any) => state.user.currentUser);

  const getUserName = (user_id: string) => {
    const user = users.find((u:any) => u.id == user_id);
    return user ? user.name : '';
  };

  const { mutate } = useMutation({
    mutationFn: () =>
      fetch('http://localhost:5000/post/repost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: currentUser.id,
          post_id: post.post_id
        }),
      }),
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: ['posts'], exact: true });
    },
  });

  return (
    <div className="border-b border-gray-200 p-4">
      {post.is_repost?<p>{getUserName(post.reposter_id) + " reposted"}</p> : <></>}
      <h2 className="font-bold">{getUserName(post.user_id)}</h2>
      <p>{post.content}</p>
      {post.is_repost? <></> : <button onClick={()=>mutate()}>Repost</button>}
    </div>
  );
};

export default Post;