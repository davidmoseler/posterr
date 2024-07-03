class Post < ApplicationRecord
  belongs_to :user, inverse_of: :posts
  has_many :reposts

  validates :content, presence: true, length: {minimum: 1, maximum: 777}

  scope :today, lambda { where('DATE(created_at) = ?', Date.today)}

  def self.table
    PostTimeline.new union(
      Post.all.select(
        %{content,
        user_id,
        created_at,
        FALSE as is_repost,
        NULL as reposter_id}
      ),
      Repost.all.joins(:post).select(
        %{posts.content,
        posts.user_id,
        reposts.created_at,
        TRUE as is_repost,
        reposts.user_id as reposter_id}
      )
    )
  end
end

class PostTimeline
  def initialize(query)
    @query = query
  end

  def latest
    PostTimeline.new @query.order(:created_at)
  end

  def trending
    PostTimeline.new @query.order(:n_reposts)
  end

  def search(string)
    PostTimeline.new @query.where(
      'content LIKE ?', "%#{ string }%"
    ).where(is_repost: false)
  end

  def execute
    @query.to_a
  end

  def method_missing(m, *args, &block)
    res = @query.send(m, *args, &block)
    if(res.is_a? Enumerable)
      PostTimeline.new res
    else
      res
    end
  end
end