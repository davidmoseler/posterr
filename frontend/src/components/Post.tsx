import React from 'react';

const Post = ({ content } : { content:string }) => {
  return (
    <div className="border-b border-gray-200 p-4">
      <p>{content}</p>
    </div>
  );
};

export default Post;