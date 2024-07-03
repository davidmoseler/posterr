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

class PostService
  def initialize(user)
    @user = user
  end

  def create_post(content)
    check_allowed
    post = Post.new content: content, user: @user
    save_post(post)
  end

  def get_posts(page, search_term: nil, sorting: "latest", base_query: Post)
    query = base_query

    if not ["latest", "trending"].include?(sorting)
      raise PostServiceException::InvalidParams
    end

    query = query.send(sorting.to_sym)

    if not search_term.nil?
      query = query.search(search_term)
    end

    if page == 1
      query = query.page(page).per(15)
    else
      query = query.page(page-1).per(20).padding(15)
    end
    return query
  end

  def repost(post)
    is_repost(post)
  end

  private

  def save_post(post)
    post.save!
  end

  def check_allowed
    if @user.posts_today.length >= 5
      raise PostServiceException::RateLimit
    end
  end

  def is_repost(post)
  end
end