<<-DOC

The PostService can be instantiated with a user, like this:

```
    post_service = PostService.new(@user)
```

Then, it exposes four methods:

```
    post_service.create_post(content)
    post_service.get_posts(page, search_term, sorting)
    post_service.n_posts(search_term, sorting)
    post_service.repost(post)
```

Both create_post and repost will do those actions on behalf of the user that was used before to
  instantiate the post services. Right now, get_posts doesn't change based on the user, but the
  service has been designed this way to anticipate the fact that, in the hypothetical future
  development of the platform, different users would probably see different feeds, so that all
  three methods are subject to the same "Point of View" context: the user.

Both post and user are only required to implement very minimal. Those interfaces, together,
represent the interface between the Service Layer and Data Access Layer.

This is what "Post" should implement:

```
    def self.new(content, user); end; => post
    def self.new_repost(post, user); end; => post
    def self.feed; end; => feed
    def save!; end;
    def user; end; => user
    def is_repost; end; => bool
```

And what "User" should implement:

```
    def posts_today; end; => post[]
```

Here, => indicates the return type and eg. post[] is a *query* of posts (not an array!).
  Capitalized (eg Post) means the class and lowercase (eg post) means an instance.

The "feed" type implements a Query Interface, as described in post_feed.rb.

DOC

class PostService
  def initialize(user)
    @user = user
  end

  def create_post(content)
    check_allowed
    save_post(Post.new content: content, user: @user)
  end

  def get_posts(page, search_term: nil, sorting: "latest", base_query: base_query())
    query = apply_filters(base_query, search_term, sorting)
    query = paginate(query, page)
    query
  end

  def repost(post)
    raise PostServiceException::RepostRepost if is_repost(post)
    raise PostServiceException::RepostOwnPost if post.user == @user

    save_post(Post.new_repost post: post, user: @user)
  end

  def n_posts(search_term: nil, sorting: "latest", base_query: base_query())
    query = apply_filters(base_query, search_term, sorting)
    query.count
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
    if search_term.blank?
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
    post.is_repost
  end

  def apply_filters(query, search_term, sorting)
    query = sort(query, sorting)
    return filter(query, search_term)
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
  def initialize(msg="You tried to repost your own post")
    super
  end
end

class PostServiceException::RepostRepost < Exception
  def initialize(msg="You tried to repost a repost")
    super
  end
end