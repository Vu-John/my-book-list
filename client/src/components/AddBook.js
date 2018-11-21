import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { getAuthorsQuery } from '../queries/queries'

class AddBook extends Component {
  renderAuthors() {
    var data = this.props.data;
    if(data.loading) {
      return (<div>Loading authors...</div>);
    } else {
      return data.authors.map((author) => {
        return (
          <option key={author.id} value={author.id}>{author.name}</option>
        );
      });
    }
  }

  render() {
    return (
      <form id="add-book">
        <div className="field">
          <label>Book name:</label>
          <input type="text" />
        </div>

        <div className="field">
          <label>Genre:</label>
          <input type="text" />
        </div>

        <div className="field">
          <label>Author:</label>
          <select>
            <option>Select Author</option>
            {this.renderAuthors()}
          </select>
        </div>

        <button>+</button>
      </form>
    );
  }
}

export default graphql(getAuthorsQuery)(AddBook);