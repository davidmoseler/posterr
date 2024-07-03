require 'rails_helper'

RSpec.describe Repost, type: :model do
  context "When the user has already reposted that post" do
    before(:each) do
      @user = User.create name: "My User"
      @other_user = User.create name: "Other User"

      @post = Post.create user: @other_user, content: "Hello"
      @repost = Repost.create user: @user, post: @post
    end

    it "it should not be possible for the user to repost again" do
      expect{Repost.create! user: @user, post: @post}.to raise_error ActiveRecord::RecordNotUnique
    end
  end
end