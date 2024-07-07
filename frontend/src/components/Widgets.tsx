import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { dependencyContainer, useDependencies } from '../dependencyContainer';
import { search } from '../state/searchSlice';
import { sortByLatest, sortByTrending } from '../state/sortingSlice';
import { RootState } from '../store';

dependencyContainer.register('Widgets', () => {
  const dispatch = useDispatch();

  const sorting = useSelector((state: RootState) => state.sorting.value);

  return {
    sorting,
    search: (searchTerm: string) => dispatch(search(searchTerm)),
    sortByLatest: () => dispatch(sortByLatest()),
    sortByTrending: () => dispatch(sortByTrending()),
  };
});

const Widgets = () => {
  const { sorting, search, sortByLatest, sortByTrending } =
    useDependencies('Widgets');

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
        <button
          className={
            'text-left my-2 p-2 rounded' + (sorting === 'latest' ? ' font-bold' : '')
          }
          onClick={() => sortByLatest()}
        >
          Latest
        </button>
        <button
          className={
            'text-left my-2 p-2 rounded' + (sorting === 'trending' ? ' font-bold' : '')
          }
          onClick={() => sortByTrending()}
        >
          Trending
        </button>
      </div>
    </div>
  );
};

export default Widgets;
