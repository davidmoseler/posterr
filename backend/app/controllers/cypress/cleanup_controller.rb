require File.join(Rails.root, "lib", "seed_db")

class Cypress::CleanupController < ActionController::Base
  def destroy
    if !Rails.env.test?
      return head(:bad_request)
    end

    tables = ActiveRecord::Base.connection.tables
    tables.delete 'schema_migrations'
    tables.each do |t|
      ActiveRecord::Base.connection.execute("TRUNCATE #{t} RESTART IDENTITY CASCADE")
    end

    seed_db

    head :ok
  end
end
