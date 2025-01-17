# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_07_07_221441) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "posts", force: :cascade do |t|
    t.text "content", null: false
    t.bigint "user_id", null: false
    t.integer "n_reposts", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_at"], name: "index_posts_on_created_at"
    t.index ["n_reposts"], name: "index_posts_on_n_reposts"
    t.index ["user_id"], name: "index_posts_on_user_id"
    t.check_constraint "char_length(content) <= 777", name: "content_max_length"
    t.check_constraint "content <> ''::text", name: "content_not_empty"
  end

  create_table "reposts", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "post_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["post_id"], name: "index_reposts_on_post_id"
    t.index ["user_id", "post_id"], name: "index_reposts_on_user_id_and_post_id", unique: true
    t.index ["user_id"], name: "index_reposts_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_users_on_name", unique: true
    t.check_constraint "name::text <> ''::text", name: "username_not_empty"
    t.check_constraint "name::text ~ '^[a-zA-Z0-9\\ ]*$'::text", name: "username_alphanumeric_check"
  end

  add_foreign_key "posts", "users"
  add_foreign_key "reposts", "posts"
  add_foreign_key "reposts", "users"
end
