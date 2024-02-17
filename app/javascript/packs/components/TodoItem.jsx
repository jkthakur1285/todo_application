import React from "react";
import PropTypes from "prop-types";
import setAxiosHeaders from "./AxiosHeaders";
import axios from "axios";
import _ from "lodash";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

class TodoItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      complete: this.props.todoItem.status == 'done' || this.props.todoItem.status == 'in_progress',
      ended: this.props.todoItem.status == 'done',
    };
    this.handleDestroy = this.handleDestroy.bind(this);
    this.path = `/api/v1/todo_items/${this.props.todoItem.id}`;
    this.handleChange = this.handleChange.bind(this);
    this.updateTodoItem = this.updateTodoItem.bind(this);
    this.titleRef = React.createRef();
    this.descriptionRef = React.createRef();
    this.statusRef = React.createRef();
  }
  handleChange() {
    this.updateTodoItem();
  }
  updateTodoItem = _.debounce(() => {
    setAxiosHeaders();
    axios
      .patch(this.path, {
        todo_item: {
          title: this.titleRef.current.value,
          description: this.descriptionRef.current.value,
          status: this.statusRef.current.state.selected.value,
        },
      })
      .then((response) => {
        const complete = response.data.status == 'done' || response.data.status == 'in_progress';
        const ended = response.data.status == 'done';
        this.setState({complete: complete, ended: ended});
        this.props.clearErrors();
      })
      .catch((error) => {
        console.log(error);
        this.props.handleErrors(error);
      });
  }, 1000);
  handleDestroy() {
    setAxiosHeaders();
    const confirmation = confirm("Are you sure?");
    if (confirmation) {
      axios
        .delete(this.path)
        .then((response) => {
          this.props.getTodoItems();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  render() {
    const { todoItem } = this.props;
    const options = [
      { value: 'todo', label:'Todo' },
      { value: 'in_progress', label: 'In Progress' },
      { value: 'done', label: 'Done' }
    ];
    return (
      <tr className={"table-light"}>
        <td className={`${this.state.ended && 'text-decoration-line-through'}`}>
        <input
            type="text"
            defaultValue={todoItem.title}
            disabled={this.state.complete}
            onChange={this.handleChange}
            ref={this.titleRef}
            className="form-control"
            id={`todoItem__title-${todoItem.id}`}
            />
        </td>
        <td className={`${this.state.ended && 'text-decoration-line-through'}`}>
        <textarea
            type="text"
            defaultValue={todoItem.description}
            disabled={this.state.complete}
            onChange={this.handleChange}
            ref={this.descriptionRef}
            className="form-control"
            id={`todoItem__description-${todoItem.id}`}
            />
        </td>
        <td>
        <Dropdown
          options={options}
          onChange={this.handleChange}
          ref={this.statusRef}
          value={todoItem.status}
          id={`todoItem__status-${todoItem.id}`}
        />
        </td>
        
        <td className="text-right">
          <button onClick={this.handleDestroy} className="btn btn-outline-danger">
            Delete
          </button>
        </td>
      </tr>
    );
  }
}

export default TodoItem;

TodoItem.propTypes = {
  todoItem: PropTypes.object.isRequired,
  getTodoItems: PropTypes.func.isRequired,
  handleErrors: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
};
