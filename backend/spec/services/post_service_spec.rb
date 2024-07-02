require 'rails_helper'

RSpec.describe PostService do
  describe "#create_post" do
    it "Should save a new post" do
    end

    it "Should belong to the correct user" do
    end

    it "A user is allowed to post up to 5 posts in one day" do
    end

    it "A user is not allowed to post more than 5 posts in one day" do
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