class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.check_constraint "name ~ '^[a-zA-Z0-9]*$'", name: "username_alphanumeric_check"
      t.check_constraint "name <> ''", name: "username_not_empty"

      t.timestamps
    end
  end
end