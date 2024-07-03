class PostController < ApplicationController
  before_action :get_post_service

  def create_post
    @post_service.create_post(params[:content])
  end

  def get_posts
    posts = @post_service.get_posts(params[:page].to_i, **get_posts_params)
    render :json => posts.execute
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
