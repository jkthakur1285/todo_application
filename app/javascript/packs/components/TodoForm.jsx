import React from "react";
import PropTypes from "prop-types";

import axios from "axios";
import setAxiosHeaders from "./AxiosHeaders";
class TodoForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.titleRef = React.createRef();
    this.descriptionRef = React.createRef();
  }

  handleSubmit(e) {
    e.preventDefault();
    setAxiosHeaders();
    axios
      .post("/api/v1/todo_items", {
        todo_item: {
          title: this.titleRef.current.value,
          description: this.descriptionRef.current.value,
          status: 'todo',
        },
      })
      .then((response) => {
        const todoItem = response.data;
        this.props.createTodoItem(todoItem);
        this.props.clearErrors();
      })
      .catch((error) => {
        this.props.handleErrors(error);
        console.log(error);
      });
    e.target.reset();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="my-3">
        <div className="form-row">
          <div className="form-group col-md-12">
            <div className="mx-3 mb-3">
              <input
                type="text"
                name="title"
                ref={this.titleRef}
                className="form-control form-input"
                id="title"
                placeholder="title"
              />
            </div>
            <div className="mx-3 mb-3">
              <textarea
                type="text"
                name="description"
                ref={this.descriptionRef}
                className="form-control"
                id="description"
                placeholder="description"
              />
            </div>
          </div>
          <div className="form-group col-md-4 mx-3">
            <button className="btn btn-outline-success btn-block">
              Add ToDo
            </button>
            {this.props.children}
          </div>
        </div>
      </form>
    );
  }
}

export default TodoForm;

TodoForm.propTypes = {
  createTodoItem: PropTypes.func.isRequired,
  handleErrors: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
};
