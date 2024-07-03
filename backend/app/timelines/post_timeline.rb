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