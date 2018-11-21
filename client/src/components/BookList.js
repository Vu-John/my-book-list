import React, { Component } from 'react';
import { graphql } from 'react-apollo'; // glue query to component
import { getBooksQuery } from '../queries/queries'

class BookList extends Component {
  renderBooks() {
    var data = this.props.data;
    if(data.loading) {
      return (<div>Loading books...</div>);
    } else {
      return data.books.map((book) => {
        return (
          <li key={book.id}>{book.name}</li>
        );
      });
    }
  }

  render() {
    return (
      <div>
        <ul id="book-list">
          {this.renderBooks()}
        </ul>
      </div>
    );
  }
}

// bind query results to this component's props
export default graphql(getBooksQuery)(BookList);
