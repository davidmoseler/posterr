require 'rails_helper'
require 'ostruct'

RSpec.describe PostService do
  before(:each) do
    @user = User.new
    @service = PostService.new(@user)
  end

  describe "#create_post" do
    before(:each) do
      allow(@service).to receive(:save_post)
    end

    context "When it has no posts" do
      before(:each) do
        @service.create_post("Hello")
      end

      it "Should save a new post" do
        expect(@service).to have_received(:save_post).with(
          an_object_having_attributes(
            :content => "Hello"
          )
        )
      end

      it "Should belong to the correct user" do
        expect(@service).to have_received(:save_post).with(
          an_object_having_attributes(
            :user => @user
          )
        )
      end
    end

    it "A user is allowed to post up to 5 posts in one day" do
      allow(@user).to receive(:posts).and_return Array.new(8) { Struct.new }
      allow(@user).to receive(:posts_today).and_return Array.new(4) { Struct.new }

      expect{@service.create_post("Hello")}.not_to raise_error
    end

    it "A user is not allowed to post more than 5 posts in one day" do
      allow(@user).to receive(:posts_today).and_return Array.new(5) { Struct.new }
      expect{@service.create_post("Hello")}.to raise_error(PostServiceException::RateLimit)
    end
  end

  describe "#get_posts" do
    it "Should return 15 posts on page 0" do
    end

    it "Should return 20 posts per page on pages larger than 0" do
    end

    it "Should return as many posts as feasible on last page" do
    end

    context "When sorting by latest, " do
      it "posts should be sorted in descending order of creation date" do
      end
    end

    context "When sorting by trending, " do
      it "posts should be sorted in descending order of number of reposts" do
      end
    end

    context "When filtering results using keywords, " do
      it "exact matches for post content are expected" do
      end

      it "non-exact matches for post content are not expected" do
      end

      it "original posts are expected" do
      end

      it "reposts are not expected" do
      end
    end
  end

  describe "#repost" do
  end
end