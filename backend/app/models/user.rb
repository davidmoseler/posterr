class User < ApplicationRecord
  validates :name, presence: true, format: /\A[a-zA-Z0-9]*\z/
end
