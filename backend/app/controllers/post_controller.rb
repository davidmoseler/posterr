class PostController < ApplicationController
  before_action :get_post_service

  def create_post
    begin
      @post_service.create_post(params[:content])
      render :json => {
        ok: true
      }, status: 200
    rescue PostServiceException::RateLimit => error
      render :json => {
        exception: error.exception
      }, status: 429
    end
  end

  def get_posts
    post_params = get_posts_params
    page = post_params.delete(:page)
    posts = @post_service.get_posts(page, **post_params)
    n_posts = @post_service.n_posts(**post_params)
    n_pages = 1 + ((n_posts-15)/20.0).ceil
    render :json => {
      data: posts.execute,
      nextPage: page+1 > n_pages ? nil : page+1
    }
  end

  def repost
    begin
      post = Post.find(params[:post_id])
      @post_service.repost(post)
      render :json => {
        ok: true
      }, status: 200
    rescue PostServiceException::RepostRepost => error
      render :json => {
        exception: error.exception
      }, status: 422
    rescue PostServiceException::RepostOwnPost => error
      render :json => {
        exception: error.exception
      }, status: 409
    end
  end

  private

  def get_post_service
    @user = User.find(params[:user_id])
    @post_service = PostService.new(@user)
  end

  def get_posts_params
    hsh = {}
    hsh[:page] = params[:page].to_i
    hsh[:search_term] = params[:search_term] unless params[:search_term].blank?
    hsh[:sorting] = params[:sorting] unless params[:sorting].blank?
    hsh
  end
end
