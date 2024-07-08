import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { dependencyContainer, useDependencies } from '../dependencyContainer';
import { useCreatePost } from '../repositories/postRepository';
import { RootState } from '../store';

dependencyContainer.register('PostBuilder', () => {
  const currentUser = useSelector(
    (state: RootState) => state.user.currentUser.id
  );

  const useCreatePostWrapper = (
    newPostContent: string,
    setNewPostContent: (content: string) => void
  ) => {
    return useCreatePost(currentUser, newPostContent, () =>
      setNewPostContent('')
    );
  };

  return {
    useCreatePost: useCreatePostWrapper,
  };
});

const PostBuilder = () => {
  const { useCreatePost } = useDependencies('PostBuilder');

  const [newPostContent, setNewPostContent] = useState<string>('');
  const createPost = useCreatePost(newPostContent, setNewPostContent);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      createPost();
    }
  };

  return (
    <>
      <div className="h-24 w-full border-b px-10 py-8">
        <textarea
          className="min-h-7 w-full border-0 overflow-auto outline-none resize-none"
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
    </>
  );
};

export default PostBuilder;
