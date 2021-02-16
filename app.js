const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product');
const path = require('path');
const SellerRoute = require('./routes/seller');
const BuyerRoute = require('./routes/buyer');
const methodOverride = require('method-override');

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

const app = express();

const ExpressError = require('./utils/ExpressError');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json())
app.use(SellerRoute)
app.use(BuyerRoute);
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/products', async(req, res) => {
    const products = await Product.find({});
    res.render('products/index', {products})
})

app.get('/products/new', (req, res) => {
    res.render('products/new')
})

app.post('/products', async (req,res) => {
    const newProduct = new Product(req.body)
    await newProduct.save()
    res.redirect(`products/${newProduct._id}`)
})

app.get('/products/:id', async(req, res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render('/products/show', {product})
})

app.get('/products/:id/edit', async (req,res) => {
    const {id} = req.params.id;
    const product = await Product.findById(id);
    res.render('products/edit', {product})
})

app.put('/products/:id', async(req, res) => {
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true})
    res.redirect(`/products/${product._id}`)
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', {err})
})

const port = process.env.PORT || 3000;
app.listen(3000, () => {
    console.log(`Serving on port ${port}`);
})