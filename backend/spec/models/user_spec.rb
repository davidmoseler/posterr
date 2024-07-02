require 'rails_helper'

RSpec.describe User, type: :model do
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

  context "can be created with alphanumeric name: " do
    ["Garfield", "Test123", "0"].each do |name|
      it "'#{name}'" do
        user = User.new name: name
        expect{user.save(validate: false)}.to_not raise_error
        expect(user).to be_valid
      end
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
end
