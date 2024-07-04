import React from 'react';

const Post = ({ author, content } : { author:string, content:string }) => {
  return (
    <div className="border-b border-gray-200 p-4">
      <h2 className="font-bold">{author}</h2>
      <p>{content}</p>
    </div>
  );
};

export default Post;