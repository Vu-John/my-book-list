const graphql = require('graphql');
const fetch = require('node-fetch');
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

//
// Google Books
//
function fetchResponseByURL(relativeURL) {
    return fetch(`${process.env.GOOGLE_BOOKS_URL}${relativeURL}key=${process.env.GOOGLE_API_KEY}`).then(res => res.json());
}

function fetchBookByID(id) {
    return fetchResponseByURL('/volumes/' + id + '?').then(json => {
        return json;
    });
}

function fetchBooksByName(name) {
    return fetchResponseByURL('/volumes?q=' + name + '&').then(json => {
        return json.items;
    });
}

const ImageLinksType = new GraphQLObjectType({
    name: 'ImageLinks',
    fields: () => ({
        smallThumbnail: {type: GraphQLString},
        thumbnail: {type: GraphQLString},
        small: {type: GraphQLString},
        medium: {type: GraphQLString},
        large: {type: GraphQLString},
        extraLarge: {type: GraphQLString}
    })
});

const VolumeInfoType = new GraphQLObjectType({
    name: 'VolumeInfo',
    fields: () => ({
        title: {type: GraphQLString},
        authors: {type: GraphQLList(GraphQLString)},
        publisher: {type: GraphQLString},
        publishedDate: {type: GraphQLString},
        description: {type: GraphQLString},
        categories: {type: GraphQLList(GraphQLString)},
        pageCount: {type: GraphQLString},
        averageRating: {type: GraphQLString},
        imageLinks: {type: ImageLinksType},
        language: {type: GraphQLString}
    })
});

const GoogleBookType = new GraphQLObjectType({
    name: 'GoogleBook',
    fields: () => ({
        id: {type: GraphQLID},
        volumeInfo: {type: VolumeInfoType}
    })
});

//
// Mongo DB
//
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
        },
        bookSearch: {
            type: new GraphQLList(BookType),
            args: {name: {type: GraphQLString}},
            resolve(parent, args) {
                if(args.name === '' || args.name === undefined) {
                    return [];
                }
                return Book.find({name: new RegExp(args.name, 'i')});
            }
        },
        googleBook: {
            type: GoogleBookType,
            args: {id: {type: GraphQLNonNull(GraphQLID)}},
            resolve(parent, args) {
                return fetchBookByID(args.id);
            }
        },
        googleBookSearch: {
            type: new GraphQLList(GoogleBookType),
            args: {name: {type: GraphQLString}},
            resolve(parent, args) {
                if(args.name === '' || args.name === undefined) {
                    return [];
                }
                return fetchBooksByName(args.name);
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