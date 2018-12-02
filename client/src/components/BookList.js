import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { getGBookQuery } from '../queries/queries'

// components
import BookDetails from './BookDetails';
import BookSearch from './BookSearch';

class BookList extends Component {
  state = {
    selected: null,
  };

  handleClearSelected = () => {
    this.setState({selected: null});
  }

  handleOnReRenderRequest = () => {
    this.forceUpdate();
  };

  renderBooks = () => {
    return (
      <Query
        query = {getGBookQuery}
        fetchPolicy = {'network-only'}
        variables = {{
          userId: '5bfb6e06fa31fa95c7179ee7' // hard code user ID for now (using user: alice@graph.cool)
        }}
      >
        {({ loading, error, data }) => {
            if(data && Object.keys(data).length !== 0) {
              return data.gBooks.map((book) => {
                return (
                  <li key={book.id} onClick={(e) => {this.setState({selected: book.id})}}>
                    {book.volumeInfo.imageLinks ? <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} /> : book.volumeInfo.title}
                  </li>
                );
              });
            } else {
              return (<div>Loading books...</div>);
            }
        }}
      </Query>
    );
  };

  render() {
    return (
      <div>
        <ul id="book-list">
          {this.renderBooks()}
        </ul>
        <BookSearch
          onReRenderParent = {this.handleOnReRenderRequest}
        />
        {
          this.state.selected ? <BookDetails bookId = {this.state.selected} onClickClear = {this.handleClearSelected} /> : ''
        }
      </div>
    );
  }
}

export default BookList;
