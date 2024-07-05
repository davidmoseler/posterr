def seed_db
  ["Me", "John Doe", "Robert Denzer", "Sheila Doe"].each do |name|
    User.create name: name
  end
end

class SeedDb
end