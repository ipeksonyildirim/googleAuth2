const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
require('dotenv').config();
const morgan = require('morgan');
const MongoStore = require('connect-mongo')(session);
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

require('./config/passport')(passport);

// connection db
connectDB();

const app = express();

// logger
if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}


// Body Parser Middleware
app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use(bodyParser.json());

// Method Override
app.use(methodOverride('_method'));

app.use(session({
  secret: 'cats',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  // cookie: { maxAge: oneDay },
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', require('./routes/index.route'));
app.use('/auth', require('./routes/auth.route'));
app.use('/student', require('./routes/student.route'));
app.use('/lecturer', require('./routes/lecturer.route'));
app.use('/personnel', require('./routes/personnel.route'));
app.use('/department', require('./routes/department.route'));

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  () => {
    console.log(`listening on: ${process.env.NODE_ENV} mode on port: ${process.env.PORT}`);
  },
);
