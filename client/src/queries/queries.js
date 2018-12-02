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

const getGBookQuery = gql`
  query($userId: ID!) {
    gBooks(userId: $userId) {
      id
      volumeInfo {
        title
        authors
        description
        imageLinks {
          thumbnail
        }
      }
    }
  }
`

const getGoogleBookQuery = gql`
  query($id: ID!) {
    googleBook(id: $id) {
      id
      volumeInfo {
        title
        authors
        description
        imageLinks {
          thumbnail
        }
      }
    }
  }
`

const getGoogleBookSearchQuery = gql`
  query($name: String) {
    googleBookSearch(name: $name) {
      id
      volumeInfo {
        title
        authors
        publisher
        publishedDate
        description
        imageLinks {
          thumbnail
        }
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

const addGBookMutation = gql`
  mutation($gBookId: ID!, $userId: ID!) {
    addGBook(
      gBookId: $gBookId, 
      userId: $userId
      ) {
        id
        gBookId
        user {
          id
          name
          email
        }
    }
  }
`

export {
    getAuthorsQuery,
    getBooksQuery,
    getBookQuery,
    getBookSearchQuery,
    getGBookQuery,
    getGoogleBookQuery,
    getGoogleBookSearchQuery,
    addBookMutation,
    addGBookMutation
}