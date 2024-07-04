require 'rails_helper'

RSpec.describe "Posts", type: :request do
  describe "GET /create_post" do
    it "returns http success" do
      @user = User.create name: "John Doe"

      post "/post/create_post", :params => { user_id: @user.id, content: "Hello!" }
      expect(response).to have_http_status(:success)
      expect(Post.count).to eq(1)
    end
  end

  describe "GET /get_posts" do
    it "returns http success" do
      @user = User.create name: "John Doe"
      Post.create user: @user, content: "Hello"
      Post.create user: @user, content: "Hello"
      Post.create user: @user, content: "Hello"

      get "/post/get_posts", :params => { user_id: @user.id, page: 1 }
      expect(response).to have_http_status(:success)
      expect(JSON.parse(response.body)['data'].length).to eq(3)
    end
  end

  describe "GET /repost" do
    it "returns http success" do
      @user = User.create name: "John Doe"
      @other_user = User.create name: "Doe John"
      @post = Post.create user: @other_user, content: "Hello"

      post "/post/repost", :params => { user_id: @user.id, post_id: @post.id }
      expect(response).to have_http_status(:success)
      expect(Repost.count).to eq(1)
    end
  end
end
