import React from 'react';
import { useSelector } from 'react-redux';
import { dependencyContainer, useDependencies } from '../dependencyContainer';
import { useRepost } from '../repositories/postRepository';
import postType from '../types/post';
import userType from '../types/user';

dependencyContainer.register('Post', ({ post }: { post: postType }) => {
  const users = useSelector((state: any) => state.user.users);
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const repost = useRepost(currentUser.id, post.post_id);

  return { users, repost };
});

const Post = ({ post }: { post: postType }) => {
  const { users, repost } = useDependencies('Post', { post });

  const getUserName = (user_id: string) => {
    const user = users.find((u: any) => u.id == user_id);
    return user ? user.name : '';
  };

  return (
    <div className="post border-b border-gray-200 p-4">
      {post.is_repost ? (
        <p>{getUserName(post.reposter_id) + ' reposted'}</p>
      ) : (
        <></>
      )}
      <h2 className="font-bold">{getUserName(post.user_id)}</h2>
      <p>{post.content}</p>
      {post.is_repost ? (
        <></>
      ) : (
        <button onClick={() => repost()}>Repost</button>
      )}
    </div>
  );
};

export default Post;
