import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { getBooksQuery } from '../queries/queries'

// components
import BookDetails from './BookDetails';
import BookSearch from './BookSearch';

class BookList extends Component {
  state = {
    selected: null,
    selectedBooks: []
  };

  handleOnBookClick = (book) => (
    this.setState({
      selectedBooks: this.state.selectedBooks.concat(book),
    })
  );

  renderBooks = () => {
    var data = this.state.selectedBooks;
    if(data) {
      return data.map((book) => {
        return (
          <li key={book.id} onClick={(e) => {this.setState({selected: book.id})}}>
            {book.volumeInfo.imageLinks ? <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} /> : book.volumeInfo.title}
          </li>
        );
      });
    } else {
      return (<div>Loading books...</div>);
    }
  };

  render() {
    return (
      <div>
        <ul id="book-list">
          {this.renderBooks()}
        </ul>
        <BookSearch
          onBookClick={this.handleOnBookClick}
        />
        <BookDetails 
          bookId = {this.state.selected}
        />
      </div>
    );
  }
}

// bind query results to this component's props
export default graphql(getBooksQuery)(BookList);
