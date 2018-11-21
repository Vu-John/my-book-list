const graphql = require('graphql');
// const _ = require('lodash'); // use to look through array (Alternative use vanilla JavaScript)
const Book = require('../models/book');
const Author = require('../models/author');

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql; // grab function from package graphql

// var books = [
//     {name:'Name of book 1', genre:'Horror',id:'1', authorId:'1'},
//     {name:'Name of book 2', genre:'Fiction',id:'2', authorId:'2'},
// ];

// var authors = [
//     {name:'John Doe', age:'22',id:'1'},
//     {name:'James Smith', age:'24',id:'2'},
// ];

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({ // this needs to to be a function because: 
        // later on when we have multiple types and they have references to one another than 
        // unless we wrap those fields into a function one type might not know what another type is
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        author: { // if user requests for the author inside a request for the book
            // use the resolve function to tell GraphQL which author corresponds to this book 
            type: AuthorType,
            resolve(parent, args) { // parent object contains book properties
                // now from the parent object we can see the author id so now we can use that id to 
                // find the author for that book
                // return _.find(authors, {id: parent.authorId});
                return Author.findById(parent.authorId);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
   name: 'Author' ,
   fields: () => ({
       id: {type: GraphQLID},
       name: {type: GraphQLString},
       age: {type: GraphQLInt},
       books: {
           type: new GraphQLList(BookType),
           resolve(parent, args) { // resolve function there for us to grab what we need
                // return _.filter(books, {authorId: parent.id});
                return Book.find({authorId: parent.id});
           }
       }
   })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: { // name of query
            type: BookType, // type of data we are querying
            args: {id: {type: GraphQLID}}, // when someone queries this book type than we expect an argument
            resolve(parent, args) { // function where we write code to get whatever data we need form our db/other source
                // parent will come into play when we look at relationships between data
                // return _.find(books, {id: args.id});
                return Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                // return _.find(authors, {id: args.id});
                return Author.findById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return books
                return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                // return authors
                return Author.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                age: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                genre: {type: GraphQLNonNull(GraphQLString)},
                authorId: {type: GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        }
    }
});

// creating a new schema and we are passing some options into the schema
// we are defining which query we are allowing the user to use when they are making queries from the front end
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});