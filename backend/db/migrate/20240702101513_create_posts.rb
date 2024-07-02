class CreatePosts < ActiveRecord::Migration[7.1]
  def change
    create_table :posts do |t|
      t.text :content, null: false
      t.references :user, null: false, foreign_key: true
      t.integer :n_reposts, null: false, default: 0
      t.check_constraint "char_length(content) <=777", name: "content_max_length"
      t.check_constraint "content <> ''", name: "content_not_empty"

      t.timestamps
    end
  end
end