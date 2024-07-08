class Repost < ApplicationRecord
  belongs_to :user
  belongs_to :post, inverse_of: :reposts

  def save
    # Make sure the n_reposts counter is updated on the post being reposted.
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
