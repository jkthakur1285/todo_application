import React from "react";
import axios from "axios";
import { createRoot } from 'react-dom/client';
import TodoItems from "./TodoItems";
import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";
import Spinner from "./Spinner";
import Dropdown from 'react-dropdown';
import ErrorMessage from "./ErrorMessage";

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todoItems: [],
      hideCompletedTodoItems: false,
      filterStatus: { value: '', label: 'All' },
      isLoading: true,
      errorMessage: null,
    };
    this.getTodoItems = this.getTodoItems.bind(this);
    this.createTodoItem = this.createTodoItem.bind(this);
    this.filterTodos = this.filterTodos.bind(this);
    this.handleErrors = this.handleErrors.bind(this);
    this.clearErrors = this.clearErrors.bind(this);
  }
  componentDidMount() {
    this.getTodoItems();
  }
  getTodoItems(status= '') {
    axios
      .get(`/api/v1/todo_items?status=${status}`)
      .then((response) => {
        this.setState({ isLoading: true });
        const todoItems = response.data;
        this.setState({ todoItems: todoItems });
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        this.setState({ isLoading: true });
        console.log(error);
      });
  }
  createTodoItem(todoItem) {
    const todoItems = [todoItem, ...this.state.todoItems];
    this.setState({ todoItems });
  }
  filterTodos( item ) {
    this.setState({ filterStatus: item });
    this.getTodoItems(item.value);
  }
  handleErrors(errorMessage) {
    this.setState({ errorMessage });
  }
  clearErrors() {
    this.setState({
      errorMessage: null,
    });
  }

  render() {
    const options = [
      { value: '', label: 'All' },
      { value: 'todo', label:'Todo' },
      { value: 'in_progress', label: 'In Progress' },
      { value: 'done', label: 'Done' }
    ];
    return (
      <>
        {!this.state.isLoading && (
          <>
            {this.state.errorMessage && (
              <ErrorMessage errorMessage={this.state.errorMessage} />
            )}
            <TodoForm
              createTodoItem={this.createTodoItem}
              handleErrors={this.handleErrors}
              clearErrors={this.clearErrors} >
            <Dropdown
              options={options}
              onChange={(val) => this.filterTodos(val)}
              value={this.state.filterStatus}
              id={`todoItem__status_filter`}
              className={'mt-3'}
            />
            </TodoForm>
            <TodoItems>
              {this.state.todoItems.map((todoItem) => (
                <TodoItem
                  key={todoItem.id}
                  todoItem={todoItem}
                  getTodoItems={this.getTodoItems}
                  handleErrors={this.handleErrors}
                  clearErrors={this.clearErrors}
                />
              ))}
            </TodoItems>
          </>
        )}
        {this.state.isLoading && <Spinner />}
      </>
    );
  }
}

document.addEventListener("turbolinks:load", () => {
  const app = document.getElementById("todo-app");
  const root = createRoot(app);
  root.render(<TodoApp />);
});
