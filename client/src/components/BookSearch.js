
import React, { Component } from 'react';
import { withApollo, Mutation } from 'react-apollo';
import { getGoogleBookSearchQuery, addGBookMutation } from '../queries/queries'

const MATCHING_ITEM_LIMIT = 25;

const INPUT_TIMEOUT = 250;

class BookSearch extends Component {
  state = {
    books: [],
    showRemoveIcon: false,
    searchValue: '',
  };

  searchBooksWrapper = () => {
    const searchQuery = this.state.searchValue;
    this.searchBooks(searchQuery);
  };

  searchBooks = async (searchQuery) => {
    if(searchQuery !== '') {
      const { data } = await this.props.client.query({
        query: getGoogleBookSearchQuery,
        variables: { name: searchQuery }
      });

      if(data) {
        if(data.googleBookSearch) {
          this.setState({
            books: data.googleBookSearch.slice(0, MATCHING_ITEM_LIMIT)
          });
        }
      }
    }
  };

  onSearchChange = (e) => {
    const value = e.target.value;

    this.setState({
      searchValue: value,
    });

    if (value === '') {
      this.setState({
        books: [],
        showRemoveIcon: false,
      });
    } else {
      this.setState({
        showRemoveIcon: true,
      });

      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.searchBooksWrapper, INPUT_TIMEOUT);
    }
  };

  onRemoveIconClick = () => {
    this.setState({
      books: [],
      showRemoveIcon: false,
      searchValue: '',
    });
  };

  renderSearchBook = () => {
    var books = this.state.books;
    if(books) {
      return books.map((book, id) => {
        return (
          <Mutation
            mutation={addGBookMutation}
            key={id}
            onCompleted={data => this._confirm(data)}
          >
            {mutation => (
              <tr
                key={book.id}
                onClick={(e, bookId = book.id) => {
                  e.preventDefault();
                  mutation({
                    variables: {
                      gBookId: bookId,
                      userId: '5bfb6e06fa31fa95c7179ee7' // hard code user ID for now (using user: alice@graph.cool)
                    }
                  });
                }}
              >
                <td>
                  {
                    book.volumeInfo.imageLinks !== null ? <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} /> : ''
                  }
                </td>
                <td>
                  {book.volumeInfo.title}
                </td>
                <td>
                  {book.volumeInfo.authors ? book.volumeInfo.authors.toString() : ''}
                </td>
              </tr>
            )}
          </Mutation>
          );
        });
    } else {
      return null;
    }
  };

  render() {
    return (
      <div id='book-search'>
        <table className='ui selectable structured large table'>
          <thead>
            <tr>
              <th colSpan='5'>
                <div className='ui fluid search'>
                  <span className='ui icon input'>
                    <input
                      className='prompt'
                      type='text'
                      placeholder='Search books to add...'
                      value={this.state.searchValue}
                      onChange={this.onSearchChange}
                    />
                    <i className='search icon' />
                  </span>
                  <span>
                    {
                      this.state.showRemoveIcon ? (
                        <i
                          className='remove icon'
                          onClick={this.onRemoveIconClick}
                        />
                      ) : ''
                    }
                  </span>
                </div>
              </th>
            </tr>
            <tr>
              {/* <th className='four wide'></th>
              <th>Book</th>
              <th>Author(s)</th> */}
            </tr>
          </thead>
          <tbody>
            {this.renderSearchBook()}
          </tbody>
        </table>
      </div>
    );
  }

  _confirm = async data => {
    this.props.onReRenderParent();
  }
}

export default withApollo(BookSearch);
