interface postType {
  post_id: string;
  content: string;
  user_id: string;
  datetime: string;
  is_repost: boolean;
  reposter_id: string;
}

export default postType;