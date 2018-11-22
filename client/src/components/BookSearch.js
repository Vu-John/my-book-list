
import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import { getBookSearchQuery } from '../queries/queries'

const MATCHING_ITEM_LIMIT = 25;

class BookSearch extends Component {
  state = {
    books: [],
    showRemoveIcon: false,
    searchValue: '',
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
      this.searchBooks(value);
    }
  };

  onRemoveIconClick = () => {
    this.setState({
      books: [],
      showRemoveIcon: false,
      searchValue: '',
    });
  };
  
  searchBooks = async (searchQuery) => {
    if(searchQuery !== '') {
      const { data } = await this.props.client.query({
        query: getBookSearchQuery,
        variables: { name: searchQuery }
      });

      if(data) {
        this.setState({
          books: data.bookSearch.slice(0, MATCHING_ITEM_LIMIT)
        });
      }
    }
  }

  renderSearchBook = () => {
    var books = this.state.books;
    if(books) {
      return books.map((book, idx) => {
        return (
          <tr
            key={idx}
          >
            <td>
              {book.name}
            </td>
            <td>
              {book.genre}
            </td>
            <td>
              {book.author.name}
            </td>
          </tr>
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
                      placeholder='Search books...'
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
              <th className='eight wide'>Name</th>
              <th>Genre</th>
              <th>Author</th>
            </tr>
          </thead>
          <tbody>
            {this.renderSearchBook()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default withApollo(BookSearch);
