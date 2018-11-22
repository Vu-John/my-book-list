import { gql } from 'apollo-boost';

const getAuthorsQuery = gql`
  { 
    authors {
      name
      id
    }
  }
`

const getBooksQuery = gql`
  {
    books {
      name
      id
    }
  }
`

const getBookQuery = gql`
  query($id: ID) {
    book(id: $id) {
      id
      name
      genre
      author {
        id
        name
        age
        books {
          name
          id
        }
      }
    }
  }
`

const getBookSearchQuery = gql`
  query($name: String) {
    bookSearch(name: $name) {
      id
      name
      genre
      author {
        name
      }
    }
  }
`

const addBookMutation = gql`
  mutation($name: String!, $genre: String!, $authorId: ID!) {
    addBook(
      name: $name, 
      genre: $genre, 
      authorId: $authorId
      ) {
        id
        name
    }
  }
`

export {
    getAuthorsQuery,
    getBooksQuery,
    getBookQuery,
    getBookSearchQuery,
    addBookMutation
}