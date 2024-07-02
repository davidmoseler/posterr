class PostService
  def initialize(user)
    @user = user
  end

  def create_post(content)
    !check_allowed
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

  def check_allowed()
  end

  def is_repost(post)
  end
end