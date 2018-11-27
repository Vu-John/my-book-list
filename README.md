## My-Book-List

![mybooklist-stack-3](https://user-images.githubusercontent.com/15070059/49104226-7093bf00-f24b-11e8-8dbc-505f8fc08709.png)

A book tracking application to keep track of books to read. Users are able to search for books in a search bar and add them to their reading list. Book data is obtained from [Google Books API](https://developers.google.com/books/). The front end is built in react with custom components for search autocomplete and book display.

### Getting Started
### Prerequisite
Make sure you have [Node.js](https://nodejs.org/en/) installed.
</br>
Login/Signup for [mLab](https://mlab.com/) and create a new SANDBOX database
</br>
Login/Signup for [Google Developer Console ](https://accounts.google.com/signin/v2/identifier?service=cloudconsole&passive=1209600&osid=1&continue=https%3A%2F%2Fconsole.developers.google.com%2F%3Fref%3Dhttps%3A%2F%2Fdevelopers.google.com%2Fbooks%2Fdocs%2Fv1%2Fusing&followup=https%3A%2F%2Fconsole.developers.google.com%2F%3Fref%3Dhttps%3A%2F%2Fdevelopers.google.com%2Fbooks%2Fdocs%2Fv1%2Fusing&flowName=GlifWebSignIn&flowEntry=ServiceLogin) and create a new project for Google Books

### Installing
1. `cd server` create an `.env` file with the contents:
```
MLAB_URL=<YOUR_MLAB_URI>
GOOGLE_BOOKS_URL=https://www.googleapis.com/books/v1
GOOGLE_API_KEY=<YOUR_GOOGLE_API_KEY>
APP_SECRET=<YOUR_RANDOM_GENEREATED_SECRET>
```
2. From the root `cd server` run `npm install` after start the server `node app.js`
3. From the root `cd client` run `npm install` after start the client `npm start`

Open up the application in `http://localhost:3000`
</br>
To test GraphQL queries and mutations go to `http://localhost:3001` for the GraphiQL interface or use GraphQL Playground *(see next section)*

### Testing GraphQL Authentication

The back end supports GraphQL Authentication using JWT tokens.
To test this out download and install [GraphQL Playground](https://github.com/prisma/graphql-playground)

1. From the root directory `cd server` and start the server `node app.js`
2. Open up GraphQL Playground. When asked for new workspace choose **URL ENDPOINT** and in the input field enter `http://localhost:3001/graphql` and open

###### Create New User/Signup
```
  mutation {
    signup(
      name: "John"
      email: "john@example.com"
      password: "graphql"
    ) {
      token
      user {
        id
      }
    }
  }
```
<img width="1196" alt="screen shot 2018-11-27 at 2 05 06 pm" src="https://user-images.githubusercontent.com/15070059/49105638-2280ba80-f24f-11e8-9b57-bc66ffdcaf2c.png">

###### Login
```
mutation {
  login(
    email: "john@example.com"
    password: "graphql"
  ) {
    token
    user {
      email
    }
  }
}
```
<img width="1195" alt="screen shot 2018-11-27 at 2 05 25 pm" src="https://user-images.githubusercontent.com/15070059/49105647-2ad8f580-f24f-11e8-8cfb-1fda9135b628.png">

###### Testing Token
Use the `token` from the login response to query and perform mutations on the data

Example:

```
mutation {
  addAuthor(
    name: "Test"
    age: 25
  ) {
    id
    name
    age
  }
}
```



### Built With

* __Frontend:__ Apollo, ReactJS
* __Backend:__ GraphQL, Node.js, Mongoose
* __Database:__ mLab (MongoDB)
