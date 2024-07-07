import React from 'react';
import { useSelector } from 'react-redux';
import { dependencyContainer, useDependencies } from '../dependencyContainer';
import { useRepost } from '../repositories/postRepository';
import TPost from '../types/post';
import TUser from '../types/user';
import { RootState } from '../store';

dependencyContainer.register('Post', ({ post }: { post: TPost }) => {
  const users = useSelector((state: RootState) => state.user.users);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const repost = useRepost(currentUser.id, post.post_id);

  return { users, repost };
});

const Post = ({ post }: { post: TPost }) => {
  const { users, repost } = useDependencies('Post', { post });

  const getUserName = (user_id: string) => {
    const user = users.find((u: TUser) => u.id == user_id);
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
        <button onClick={() => repost()}>
          <svg
            className="text-teal-600"
            width="20px"
            height="25px"
            viewBox="0 0 24 24"
            stroke="#000000"
            strokeWidth="2"
            fill="none"
          >
            {' '}
            <title id="repostIconTitle">Repost</title>{' '}
            <path d="M13 18L6 18L6 7" /> <path d="M3 9L6 6L9 9" />{' '}
            <path d="M11 6L18 6L18 17" /> <path d="M21 15L18 18L15 15" />{' '}
          </svg>
          {/* <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1xvli5t r-1hdv0qi"
          >
            <g>
              <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path>
            </g>
          </svg> */}
        </button>
      )}
    </div>
  );
};

export default Post;
