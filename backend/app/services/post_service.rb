class PostServiceException < Exception
end
class PostServiceException::RateLimit < Exception
  def initialize(msg="You have exceeded the post creation quota for the time being")
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

  def get_posts(page, filter: nil, sorting: "latest")
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