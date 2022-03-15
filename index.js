const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose')
const session = require('express-session')
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db')
const methodOverride = require('method-override');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const breadcrumb = require('express-url-breadcrumb');
const multer = require('multer');
var faker = require('faker');

//var cookieParser = require('cookie-parser');


//Load config
dotenv.config({path : './config/config.env'})

//passport config
require('./config/passport')(passport)

//connection db
connectDB();


const app = express();

//logger
if(process.env.NODE_ENV = 'development'){
    app.use(morgan('dev'));
}

//handlebars
app.engine('.hbs', exphbs.engine({ defaulLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs')
/*
//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

/*
//cookies expiredTime
const oneDay = 1000 * 60 * 60 * 24;
var sessions;
*/


// Load Helpers
const {
    paginate,
    select,
    if_eq,
    select_course
} = require('./helpers/customHelpers');
app.engine('.handlebars', exphbs.engine({ extname: '.hbs', defaultLayout: "main",helpers: {
    paginate: paginate,
    select: select,
    if_eq: if_eq,
    select_course: select_course
}}));


app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));

// Express URL Breadcrumbs
app.use(breadcrumb());

// Body Parser Middleware
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

// Method Override
app.use(methodOverride('_method'));


app.use(session({
    secret: 'cats', 
    resave: false,
    saveUninitialized: false,
    store: new MongoStore( {mongooseConnection: mongoose.connection})
    //cookie: { maxAge: oneDay },
 }));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());
//app.use(cookieParser());
// Set global var

app.use(flash());


// Routes
app.use('/', require('./routes/index.route'))
app.use('/auth', require('./routes/auth.route'))
app.use('/student', require('./routes/student.route'))
app.use('/lecturer', require('./routes/lecturer.route'))
app.use('/personel', require('./routes/personel.route'))
app.use('/department', require('./routes/department.route'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`listening on: ${process.env.NODE_ENV} mode on port: ${process.env.PORT}`));