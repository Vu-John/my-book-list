import React, { Component } from 'react';
import { Query } from 'react-apollo'; // glue query to component
import { getGoogleBookQuery } from '../queries/queries';

class BookDetails extends Component {
  renderBookDetails = (id) => (
    <Query query={getGoogleBookQuery} variables={{ id }}>
      {({ loading, error, data }) => {
        if (loading) return (
          <p>Loading...</p>
        );
        if (error) return `Error!: ${error}`;

        const book = data.googleBook.volumeInfo

        return (
          <div>
            {book.imageLinks ? <img src={book.imageLinks.thumbnail} alt={book.title} /> : ''}
            <h2>{book.title}</h2>
            <p>{book.authors.toString()}</p>
            <p>{book.description}</p>
          </div>
        );
      }}
    </Query>
  );

  render() {
    const bookId = this.props.bookId;
    return (
      <div id="book-details">
        {bookId ? this.renderBookDetails(bookId) : ''}
      </div>
    );
  }
}

export default BookDetails;
