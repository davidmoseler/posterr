class User < ApplicationRecord
  has_many :posts

  validates :name, presence: true, format: /\A[a-zA-Z0-9\ ]*\z/

  def posts_today
    posts.today
  end
end
