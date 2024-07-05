Rails.application.routes.draw do
  if Rails.env.test?
    namespace :cypress do
      delete 'cleanup', to: 'cleanup#destroy'
    end
  end
  post 'post/create_post'
  get 'post/get_posts'
  post 'post/repost'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
