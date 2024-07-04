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
    before(:each) do
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
    before(:each) do
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
    before(:each) do
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

  context "When filtering results using keywords, " do
    before(:each) do
      Post.create! user: @user, content: "Search for this"
      Post.create! user: @user, content: "I will search for this"
      Post.create! user: @user, content: "Let's try. Search for this."
      Post.create! user: @user, content: "Search fuzzy for this."

      @posts = Post.feed.search("Search for this").execute
    end

    it "exact matches for post content are expected" do
      expect(@posts).to include(
        an_object_having_attributes(content: "Search for this")
      )

      expect(@posts).to include(
        an_object_having_attributes(content: "Let's try. Search for this.")
      )
    end

    it "non-exact matches for post content are not expected" do
      expect(@posts).not_to include(
        an_object_having_attributes(content: "I will search for this")
      )

      expect(@posts).not_to include(
        an_object_having_attributes(content: "Search fuzzy for this")
      )
    end

  end

  describe "#feed" do
    it "returns a query" do
      expect{Post.feed.order(:created_at)}.not_to raise_error
    end

    context "has only posts" do
      before(:each) do
        @post = Post.create! user: @user, content: "Hello"
      end

      it "returns the posts" do
        expect(Post.feed.length).to eq(1)
      end
    end

    context "has both posts and reposts" do
      before(:each) do
        @post = Post.create! user: @user, content: "Hello"
        Repost.create! user: @user, post: @post
      end

      it "returns both posts and reposts" do
        expect(Post.feed.length).to eq(2)
      end
    end
  end
end
