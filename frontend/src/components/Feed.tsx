import React, { useState, useEffect } from 'react';
import Post from './Post';
import user from "../types/user";
import post from "../types/post";

const Feed = ({currentUser} : {currentUser : user}) => {
  const [posts, setPosts] = useState<post[]>([]);
  const [newPostContent, setNewPostContent] = useState<string>('');

  const createPost = () => {
    setPosts([
      ...posts,
      { content: newPostContent, author: currentUser.name, datetime: 'Now' },
    ]);
    setNewPostContent("");
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      createPost();
    }
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
            onClick={createPost}
          >
            Post
          </button>
        </div>
      </div>
      <div>
        {posts.map((post) => (
          <Post author={post.author} content={post.content} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
