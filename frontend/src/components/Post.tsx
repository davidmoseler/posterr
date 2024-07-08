import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { dependencyContainer, useDependencies } from '../dependencyContainer';
import { useRepost } from '../repositories/postRepository';
import TPost from '../types/post';
import TUser from '../types/user';
import { RootState } from '../store';
import Modal from 'react-modal';

dependencyContainer.register('Post', ({ post }: { post: TPost }) => {
  const users = useSelector((state: RootState) => state.user.users);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const repost = useRepost(currentUser.id, post.post_id);

  return { users, repost };
});

const Post = ({ post }: { post: TPost }) => {
  const { users, repost } = useDependencies('Post', { post });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getUserName = (user_id: string) => {
    const user = users.find((u: TUser) => u.id == user_id);
    return user ? user.name : '';
  };

  const confirmRepost = () => {
    repost();
    setIsModalOpen(false);
  };

  return (
    <div className="post border-b border-gray-200 p-4">
      {post.repost ? (
        <p>{`${getUserName(post.reposter_id)} reposted`}</p>
      ) : null}
      <h2>
        <span className="font-bold">{getUserName(post.user_id)}</span>
        <span className="pl-3 text-gray-400">
          {post.created_at.split('T')[0]}
        </span>
      </h2>
      <p>{post.content}</p>
      {!post.repost && (
        <button data-testid="repost" onClick={() => setIsModalOpen(true)}>
          <svg
            className="text-teal-600"
            width="20px"
            height="25px"
            viewBox="0 0 24 24"
            stroke="#000000"
            strokeWidth="2"
            fill="none"
          >
            <title id="repostIconTitle">Repost</title>
            <path d="M13 18L6 18L6 7" />
            <path d="M3 9L6 6L9 9" />
            <path d="M11 6L18 6L18 17" />
            <path d="M21 15L18 18L15 15" />
          </svg>
        </button>
      )}
      <Modal
        id="confirmation-modal"
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Confirm Repost"
        ariaHideApp={false}
        className="rounded-xl m-auto h-36 w-1/3 bg-white fixed inset-0 flex flex-col items-center justify-center p-2 z-50 "
        overlayClassName="fixed inset-0 bg-black bg-opacity-10"
      >
        <h2 className="m-1">Are you sure you want to repost?</h2>
        <div className="p-3 flex">
          <button
            className="mx-3 bg-blue-400 text-white w-16 h-9 rounded-3xl"
            onClick={confirmRepost}
          >
            Yes
          </button>
          <button
            className="mx-3 bg-blue-400 text-white w-16 h-9 rounded-3xl"
            onClick={() => setIsModalOpen(false)}
          >
            No
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Post;
