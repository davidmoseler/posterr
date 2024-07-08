class Post < ApplicationRecord
  belongs_to :user, inverse_of: :posts
  has_many :reposts

  validates :content, presence: true, length: {minimum: 1, maximum: 777}

  scope :today, lambda { where('DATE(created_at) = ?', Date.today)}

  def self.feed
    PostFeed.new union(
      Post.all.select(
        %{posts.id as post_id,
        content,
        user_id,
        created_at,
        n_reposts,
        FALSE as repost,
        NULL as reposter_id}
      ),
      Repost.all.joins(:post).select(
        %{reposts.id as post_id,
        posts.content,
        posts.user_id,
        reposts.created_at,
        posts.n_reposts,
        TRUE as repost,
        reposts.user_id as reposter_id}
      )
    )
  end

  def self.new_repost(*args)
    Repost.new *args
  end

  def is_repost
    false
  end
end