const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose')
const session = require('express-session')
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db')
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
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
  })
// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
//const auth = require('./auth');
//const connectDB = require('./config/db');

/*function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}*/


/*app.get('/', (req, res) => {
    sessions=req.session;
    console.log(req.session)
    if(req.session.isFirst || req.cookies.isFirst){
        res.send(`Welcome ${req.user.displayName} <a href=\'/logout'>click to logout</a>`);
    }else{
        req.session.isFirst = 1;
        res.cookie('isFirst', 1, { maxAge: 60 * 1000, singed: true});
        res.send('<a href="/auth/google"> Authenticate with Google </a>');

    }
});

app.get('/auth/google', 
    passport.authenticate('google',{scope: ['email', 'profile']})
);

app.get('/google/callback', 
    passport.authenticate('google',{successRedirect: '/protected',
failureRedirect: '/auth/failure'})
);


app.get('/auth/failure', (req, res) => {
    res.send('something went wrong..');
});

app.get('/protected', isLoggedIn, (req, res) => {
    res.send(`Hello ${req.user.displayName}`);
});

app.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('Goodbye');
})
*/
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`listening on: ${process.env.NODE_ENV} mode on port: ${process.env.PORT}`));