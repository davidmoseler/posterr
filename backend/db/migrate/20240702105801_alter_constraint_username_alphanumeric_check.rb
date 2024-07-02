class AlterConstraintUsernameAlphanumericCheck < ActiveRecord::Migration[7.1]
  def up
    remove_check_constraint :users, name: "username_alphanumeric_check"
    add_check_constraint :users, "name ~ '^[a-zA-Z0-9\\ ]*$'", name: "username_alphanumeric_check"
  end

  def down
    remove_check_constraint :users, name: "username_alphanumeric_check"
    add_check_constraint :users, "name ~ '^[a-zA-Z0-9]*$'", name: "username_alphanumeric_check"
  end
end
