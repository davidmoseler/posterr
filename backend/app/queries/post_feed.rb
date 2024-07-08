class PostFeed
  def initialize(query)
    @query = query
  end

  def latest
    PostFeed.new @query.order(created_at: :desc)
  end

  def trending
    PostFeed.new @query.order(n_reposts: :desc)
  end

  def search(string)
    PostFeed.new @query.where(
      'content LIKE ?', "%#{ string }%"
    )
  end

  def original
    PostFeed.new @query.where(repost: false)
  end

  def execute
    @query.to_a
  end

  def method_missing(m, *args, &block)
    res = @query.send(m, *args, &block)
    if(res.is_a? Enumerable)
      PostFeed.new res
    else
      res
    end
  end
end