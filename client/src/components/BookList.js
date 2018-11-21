import React, { Component } from 'react';
import { graphql } from 'react-apollo'; // glue query to component
import { getBooksQuery } from '../queries/queries'

// components
import BookDetails from './BookDetails';

class BookList extends Component {
  state = {
    selected: null
  };

  renderBooks = () => {
    var data = this.props.data;
    if(data.loading) {
      return (<div>Loading books...</div>);
    } else {
      return data.books.map((book) => {
        return (
          <li key={book.id} onClick={(e) => {this.setState({selected: book.id})}}>{book.name}</li>
        );
      });
    }
  };

  render() {
    return (
      <div>
        <ul id="book-list">
          {this.renderBooks()}
        </ul>
        <BookDetails 
          bookId = {this.state.selected}
        />
      </div>
    );
  }
}

// bind query results to this component's props
export default graphql(getBooksQuery)(BookList);
