class AddIndexesToPost < ActiveRecord::Migration[7.1]
  def change
    add_index :posts, :created_at
    add_index :posts, :n_reposts
  end
end
