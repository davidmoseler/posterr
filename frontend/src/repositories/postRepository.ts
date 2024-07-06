import { useQueryClient, useInfiniteQuery, useMutation } from '@tanstack/react-query';

async function getPosts(
  user_id: string,
  page: number,
  searchTerm: string,
  sorting: string
) {
  const response = await fetch(
    'http://localhost:5000/post/get_posts?' +
    'page=' +
    page +
    '&user_id=' +
    user_id +
    '&search_term=' +
    searchTerm +
    '&sorting=' +
    sorting,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.json();
}

const postRepository = {
  useRepost: (userId: string, postId: string) => {
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
      mutationFn: () =>
        fetch('http://localhost:5000/post/repost', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            post_id: postId,
          }),
        }),
      onSuccess: () => {
        queryClient.resetQueries({ queryKey: ['posts'], exact: true });
      },
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
        fetch('http://localhost:5000/post/create_post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: currentUser,
            content: newPostContent,
          }),
        }),
      onSuccess: () => {
        onSuccess();
        queryClient.resetQueries({ queryKey: ['posts'], exact: true });
      },
    });

    return mutate;
  }
}

export default postRepository;

export const { useGetPosts, useCreatePost, useRepost } = postRepository;