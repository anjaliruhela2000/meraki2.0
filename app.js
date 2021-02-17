const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product');
const Buyer = require('./models/buyer');
const path = require('path');
const SellerRoutes = require('./routes/seller');
const BuyerRoutes = require('./routes/buyer');
const ProductRoutes = require('./routes/product');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
const flash = require('connect-flash');
const {productSchema} = require('./schemas.js');
const passport = require('passport');
const localStrategy = require('passport-local');

mongoose.connect('mongodb://localhost:27017/meraki', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json())
app.use(SellerRoutes)
app.use(BuyerRoutes);
app.use(ProductRoutes);
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

const sessionConfig = {
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(Buyer.authenticate()));

passport.serializeUser(Buyer.serializeUser());
passport.deserializeUser(Buyer.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})

app.get('/', (req, res) => {
    res.render('home');
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