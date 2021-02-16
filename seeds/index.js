const mongoose = require('mongoose');
const Product = require('../models/product');

mongoose.connect('mongodb://localhost:27017/meraki', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedProducts = [
    {
        title: 'Oranges',
        category: 'fruit',
        price: 20,
        description: 'sjgds sdahgj JKagdhkjs sadghaskd'
    },
    {
        title: 'Cakes',
        category: 'bakery',
        price: 200,
        description: 'sjgds sdahgj JKagdhkjs sadghaskd'
    },
    {
        title: 'Woollen Caps',
        category: 'clothing',
        price: 500,
        description: 'sjgds sdahgj JKagdhkjs sadghaskd'
    },
    {
        title: 'Eggs',
        category: 'dairy',
        price: 50,
        description: 'sjgds sdahgj JKagdhkjs sadghaskd'
    },
]

Product.insertMany(seedProducts)
    .then(res => {
        console.log(res)
    })
    .catch(e => {
        console.log(e)
    })