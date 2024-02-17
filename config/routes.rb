Rails.application.routes.draw do
  root 'pages#home'
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :todo_items, only: %i[index show create update destroy]
    end
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
