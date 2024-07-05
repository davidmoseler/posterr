import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { dependencyContainer, useDependencies } from '../dependencyContainer';
import { search } from '../state/searchSlice';
import { sortByLatest, sortByTrending } from '../state/sortingSlice';

dependencyContainer.register('Widgets', () => {
  const dispatch = useDispatch();

  return {
    search: (searchTerm: string) => dispatch(search(searchTerm)),
    sortByLatest: () => dispatch(sortByLatest()),
    sortByTrending: () => dispatch(sortByTrending()),
  };
});

const Widgets = () => {
  const {search, sortByLatest, sortByTrending} = useDependencies('Widgets');

  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      search(searchTerm);
    }
  };

  return (
    <div className="pl-8 pr-16 w-2/6 border-l border-gray-200">
      <input
        className="outline-none my-4 py-4 px-10 h-12 w-full bg-gray-100 rounded-3xl"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyPress}
      ></input>
      <div className="p-4 flex flex-col">
        <h2 className="my-4 text-xl font-bold">What's happening</h2>
        <a className="my-4 p-2 rounded" onClick={() => sortByLatest()}>
          Latest
        </a>
        <a className="my-4 p-2 rounded" onClick={() => sortByTrending()}>
          Trending
        </a>
      </div>
    </div>
  );
};

export default Widgets;
