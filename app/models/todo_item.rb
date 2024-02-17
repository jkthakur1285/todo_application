class TodoItem < ApplicationRecord

  validates :title, presence: true
  validates :status, inclusion: { in: %w(todo in_progress done) }
  
  default_scope { order(created_at: :desc) }
end
