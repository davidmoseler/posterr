require 'rails_helper'

RSpec.describe User, type: :model do
  context "can be created with alphanumeric name: " do
    ["John Doe", "Garfield", "Test123", "0"].each do |name|
      it "'#{name}'" do
        @user = User.new name: name
        expect(@user).to be_valid
        expect{@user.save!}.to_not raise_error
      end
    end
  end

  context "name cannot be empty. " do
    before(:all) do
      @user = User.new name: ""
    end

    it "The database should invoke a constraint when saving with an empty name." do
      expect{@user.save(validate: false)}.to raise_error(ActiveRecord::StatementInvalid)
    end

    it "Should not be validated with empty name" do
      expect(@user).to_not be_valid
    end
  end

  context "name cannot be null. " do
    before(:all) do
      @user = User.new
    end

    it "The database should invoke a constraint when saving with no name." do
      expect{@user.save(validate: false)}.to raise_error(ActiveRecord::StatementInvalid)
    end

    it "Should not be validated without a name" do
      expect(@user).to_not be_valid
    end
  end

  context "cannot have a non-alphanumeric name. " do
    ["%", "Test.123", "0_0"].each do |name|
      before(:all) do
        @user = User.new name: name
      end

      it "The database should invoke a constraint when saving with name #{name}" do
        expect{@user.save(validate: false)}.to raise_error(ActiveRecord::StatementInvalid)
      end

      it "Should not be validated with name #{name}" do
        expect(@user).to_not be_valid
    end
    end
  end

  it "name should be unique" do
    @user = User.new name: "John Doe"
    @other_user = User.new name: "John Doe"

    @user.save!
    expect{@other_user.save!}.to raise_error(ActiveRecord::StatementInvalid)
  end

  it "should implement #posts" do
    @user = User.new name: "John Doe"
    @user.save!

    expect(@user.posts.length).to equal(0)

    5.times do
      post = Post.new(content: "A", user: @user)
      post.save!
    end
    expect(@user.posts.length).to equal(5)
  end

  it "should implement #posts_today" do
    @user = User.new name: "John Doe"
    @user.save!

    expect(@user.posts.length).to equal(0)

    travel_to(Date.yesterday) do
      3.times do
        post = Post.new(content: "A", user: @user)
        post.save!
      end
    end

    5.times do
      post = Post.new(content: "A", user: @user)
      post.save!
    end
    expect(@user.posts.length).to equal(8)
    expect(@user.posts_today.length).to equal(5)
  end
end
