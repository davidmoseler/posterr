import React from 'react';

const Widgets = () => {
  return (
    <div className="pl-8 pr-16 w-2/6 border-l border-gray-200">
      <input className="outline-none my-4 py-4 px-10 h-12 w-full bg-gray-100 rounded-3xl" placeholder="Search"></input>
      <div className="p-4 flex flex-col">
        <h2 className="my-4 text-xl font-bold">What's happening</h2>
        <a className="my-4 p-2 rounded">Latest</a>
        <a className="my-4 p-2 rounded">Trending</a>
      </div>
    </div>
  );
};

export default Widgets;