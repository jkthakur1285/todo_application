module Api
  module V1
    class TodoItemsController < ApplicationController
      before_action :set_todo_item, only: %i[show edit update destroy]
    
      def index
        @todo_items = if params[:status].present?
                        TodoItem.where(status: params[:status] )
                      else
                        TodoItem.all
                      end
      end
    
      def show
      end
    
      def create
        @todo_item = TodoItem.create(todo_item_params)

        respond_to do |format|
          if can_create_todo_item?
            if @todo_item.save
              format.json do
                render :show,
                      status: :created,
                      location: api_v1_todo_item_path(@todo_item)
              end
            else
              format.json do
                render json: @todo_item.errors, status: :unprocessable_entity
              end
            end
          else
            format.json do
              render json: { limit: ["Cannot create new 'To Do' task. Over 50% of tasks are already in 'To Do' status."] }, status: :unprocessable_entity
            end
          end
        end
      end
    
      def update
        respond_to do |format|
          if @todo_item.update(todo_item_params)
            format.json do
              render :show,
                     status: :ok,
                     location: api_v1_todo_item_path(@todo_item)
            end
          else
            format.json do
              render json: @todo_item.errors, status: :unprocessable_entity
            end
          end
        end
      end
    
      def destroy
        @todo_item.destroy
        respond_to { |format| format.json { head :no_content } }
      end
    
      private

      def todo_item_params
        params.require(:todo_item).permit(:title, :description, :status)
      end
    
      def set_todo_item
        @todo_item = TodoItem.find(params[:id])
      end

      def can_create_todo_item?
        return true if todo_item_params[:status] != "todo"
      
        total_items = TodoItem.count
        todo_items = TodoItem.where(status: "todo").count
        todo_items <= 10 || (todo_items.to_f / total_items) < 0.5
      end
    end
  end
end