const graphql = require('graphql');
const fetch = require('node-fetch');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { getUserId } = require('../utils')
const Book = require('../models/book');
const Author = require('../models/author');
const User = require('../models/user');

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

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
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        email: {type: GraphQLString}
    })
});

const AuthPayloadType = new GraphQLObjectType({
    name: 'AuthPayload',
    fields: () => ({
        token: {type: GraphQLString},
        user: {type: UserType}
    })
});

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({ 
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args) {
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
           resolve(parent, args) {
                return Book.find({authorId: parent.id});
           }
       }
   })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Author.findById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
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

const RootMutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                age: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, context) {
                getUserId(context);
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
            resolve(parent, args, context) {
                getUserId(context);
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        },
        signup: {
            type: AuthPayloadType,
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                email: {type: GraphQLNonNull(GraphQLString)},
                password: {type: GraphQLNonNull(GraphQLString)}
            },
            async resolve(parent, args, context) {
                const password = await bcrypt.hash(args.password, 10);
                let user = new User({
                  ...args, password
                });
                
                user.save();
              
                const token = jwt.sign({userId: user.id}, process.env.APP_SECRET);

                return {
                    token,
                    user
                }
            }
        },
        login: {
            type: AuthPayloadType,
            args: {
                email: {type: GraphQLNonNull(GraphQLString)},
                password: {type: GraphQLNonNull(GraphQLString)}
            },
            async resolve(parent, args, context) {
                const user = await User.findOne({email: args.email});

                if (!user) {
                    throw new Error('No such user found')
                }

                const valid = await bcrypt.compare(args.password, user.password)
                if (!valid) {
                    throw new Error('Invalid password')
                }

                const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

                return {
                    token,
                    user,
                }
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
});