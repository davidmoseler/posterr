/*
  Abstracts away the interface to the backend from the rest of the React application. This
    provides a group of hooks that can be used by React components. These hooks provide backend
    data and mutation methods to the components.
*/

import { useQueryClient, useInfiniteQuery, useMutation } from '@tanstack/react-query';
import fetchWrapper, {onError} from './fetchWrapper';

async function getPosts(
  user_id: string,
  page: number,
  searchTerm: string,
  sorting: string
) {
  return fetchWrapper(
    '/post/get_posts?' +
    'page=' +
    page +
    '&user_id=' +
    user_id +
    '&search_term=' +
    searchTerm +
    '&sorting=' +
    sorting,
  )
}

const postRepository = {
  useRepost: (userId: string, postId: string) => {
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
      mutationFn: () =>
        fetchWrapper('/post/repost', {
          method: 'POST',
          body: JSON.stringify({
            user_id: userId,
            post_id: postId,
          }),
        }),
      onSuccess: () => {
        queryClient.resetQueries({ queryKey: ['posts'], exact: true });
      },
      onError
    });

    return mutate;
  },
  useGetPosts: (
    currentUser: string,
    searchTerm: string,
    sorting: string
  ) => {
    return useInfiniteQuery({
      queryKey: ['posts'],
      queryFn: ({ pageParam }: { pageParam: number }) =>
        getPosts(currentUser, pageParam, searchTerm, sorting),
      initialPageParam: 1,
      getNextPageParam: (lastPage: { nextPage: number }) => lastPage.nextPage,
    });
  },
  useCreatePost: (
    currentUser: string,
    newPostContent: string,
    onSuccess: () => any
  ) => {
    const queryClient = useQueryClient();
    const { mutate } = useMutation({
      mutationFn: () =>
        fetchWrapper('/post/create_post', {
          method: 'POST',
          body: JSON.stringify({
            user_id: currentUser,
            content: newPostContent,
          }),
        }),
      onSuccess: () => {
        onSuccess();
        queryClient.resetQueries({ queryKey: ['posts'], exact: true });
      },
      onError,
    });

    return mutate;
  }
}

export default postRepository;

export const { useGetPosts, useCreatePost, useRepost } = postRepository;