class Post < ApplicationRecord
  belongs_to :user, inverse_of: :posts

  validates :content, presence: true, length: {minimum: 1, maximum: 777}

  scope :today, lambda { where('DATE(created_at) = ?', Date.today)}
  scope :latest, -> { order(:created_at) }
  scope :trending, -> { order(:n_reposts) }
  scope :search, ->(string){ where('content LIKE ?', "%#{ string }%")}
end
