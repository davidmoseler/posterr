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
    before(:each) do
      @all_posts = Kaminari.paginate_array(Array.new(64) {Post.new})

      def @all_posts.latest; end
      def @all_posts.trending; end
      allow(@all_posts).to receive(:latest).and_return(@all_posts)
      allow(@all_posts).to receive(:trending).and_return(@all_posts)
    end

    it "Should return 15 posts on page 1" do
      posts = @service.get_posts(1, base_query: @all_posts)
      expect(posts.length).to eq(15)
    end

    it "Should return 20 posts per page on pages larger than 1" do
      posts = @service.get_posts(2, base_query: @all_posts)
      expect(posts.length).to eq(20)

      posts = @service.get_posts(3, base_query: @all_posts)
      expect(posts.length).to eq(20)
    end

    it "Should return as many posts as feasible on last page" do
      posts = @service.get_posts(4, base_query: @all_posts)
      expect(posts.length).to eq(9)
    end

    context "When sorting by latest, " do
      before(:each) do
        @posts = @service.get_posts(2, base_query: @all_posts)
      end

      it "posts should be sorted in descending order of creation date" do
        expect(@all_posts).to have_received(:latest)
      end
    end

    context "When sorting by trending, " do
      before(:each) do
        @posts = @service.get_posts(2, sorting: "trending", base_query: @all_posts)
      end

      it "posts should be sorted in descending order of number of reposts" do
        expect(@all_posts).to have_received(:trending)
      end
    end

    context "When filtering results using keywords, " do
      before(:each) do
        @all_posts[4].content = "Search for this"
        @all_posts[8].content = "I will search for this"
        @all_posts[12].content = "Let's try. Search for this."
        @all_posts[14].content = "Search fuzzy for this."

        def @all_posts.search(string)
          Kaminari.paginate_array(
            self.select{|p| p.content and p.content.include? string}
          )
        end

        @posts = @service.get_posts(1, search_term: "Search for this", base_query: @all_posts)
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

      it "original posts are expected" do
      end

      it "reposts are not expected" do
      end
    end
  end

  describe "#repost" do
  end
end