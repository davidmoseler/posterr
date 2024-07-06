class Repost < ApplicationRecord
  belongs_to :user
  belongs_to :post, inverse_of: :reposts

  def save
    Repost.transaction do
      super
      post.n_reposts +=1
      post.save!
    end
  end

  def is_repost
    true
  end
end
