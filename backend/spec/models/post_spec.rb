require 'rails_helper'

RSpec.describe Post, type: :model do
  before(:each) do
    @user = User.new name: "John Doe"
    @user.save!
  end

  it "should be able to be created with up to 777 characters" do
    content = "a" * 777
    @post = Post.new content: content, user: @user
    expect(@post).to be_valid
    expect{@post.save!}.not_to raise_error
  end

  context "content cannot be empty. " do
    before(:all) do
      @post = Post.new content: "", user: @user
    end

    it "The database should invoke a constraint when saving with an empty content." do
      expect{@post.save(validate: false)}.to raise_error(ActiveRecord::StatementInvalid)
    end

    it "Should not be validated with empty content" do
      expect(@post).to_not be_valid
    end
  end

  context "content cannot be null. " do
    before(:all) do
      @post = Post.new user: @user
    end

    it "The database should invoke a constraint when saving with no content." do
      expect{@post.save(validate: false)}.to raise_error(ActiveRecord::StatementInvalid)
    end

    it "Should not be validated without a content" do
      expect(@post).to_not be_valid
    end
  end

  context "content cannot exceed 777 characters. " do
    before(:all) do
      content = "a" * 778
      @post = Post.new user: @user, content: content
    end

    it "The database should invoke a constraint when saving with over 777 characters." do
      expect{@post.save(validate: false)}.to raise_error(ActiveRecord::StatementInvalid)
    end

    it "Should not be validated with over 777 characters" do
      expect(@post).to_not be_valid
    end
  end
end
