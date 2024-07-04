class PostService
  def initialize(user)
    @user = user
  end

  def create_post(content)
    check_allowed
    post = Post.new content: content, user: @user
    save_post(post)
  end

  def get_posts(page, search_term: nil, sorting: "latest", base_query: base_query())
    query = sort(base_query, sorting)
    query = filter(query, search_term)
    query = paginate(query, page)
    query
  end

  def repost(post)
    raise PostServiceException::RepostRepost if is_repost(post)
    raise PostServiceException::RepostOwnPost if post.user == @user

    repost = Repost.new post: post, user: @user
    save_repost(repost)
  end

  private

  def save_post(post)
    post.save!
  end

  def save_repost(repost)
    repost.save!
  end

  def check_allowed
    if @user.posts_today.length >= 5
      raise PostServiceException::RateLimit
    end
  end

  def base_query
    Post.feed
  end

  def sort(query, sorting)
    if not ["latest", "trending"].include?(sorting)
      raise PostServiceException::InvalidParams
    end

    if sorting == "trending"
      query = query.original
    end

    query.send(sorting.to_sym)
  end

  def filter(query, search_term)
    if search_term.nil?
      query
    else
      query = query.original
      query.search(search_term)
    end
  end

  def paginate(query, page)
    if page == 1 then
      query.page(page).per(15)
    else
      query.page(page-1).per(20).padding(15)
    end
  end

  def is_repost(post)
    post.instance_of? Repost
  end
end

class PostServiceException < Exception
end

class PostServiceException::RateLimit < Exception
  def initialize(msg="You have exceeded the post creation quota for the time being")
    super
  end
end

class PostServiceException::InvalidParams < Exception
  def initialize(msg="The post service has received invalid parameters")
    super
  end
end

class PostServiceException::RepostOwnPost < Exception
  def initialize(msg="The user is trying to repost their own post")
    super
  end
end

class PostServiceException::RepostRepost < Exception
  def initialize(msg="The user is trying to repost a repost")
    super
  end
end