class PostController < ApplicationController
  before_action :get_post_service

  def create_post
    @post_service.create_post(params[:content])
  end

  def get_posts
    page = params[:page].to_i
    posts = @post_service.get_posts(page, **get_posts_params)
    n_pages = 1 + (posts.length-10)/15
    render :json => {
      data: posts.execute,
      nextPage: page+1 > n_pages ? page+1 : nil
    }
  end

  def repost
    post = Post.find(params[:post_id])
    @post_service.repost(post)
  end

  private

  def get_post_service
    @user = User.find(params[:user_id])
    @post_service = PostService.new(@user)
  end

  def get_posts_params
    hsh = {}
    hsh[:search_term] = params[:search_term] if params[:search_term]
    hsh[:sorting] = params[:sorting] if params[:sorting]
    hsh
  end
end
