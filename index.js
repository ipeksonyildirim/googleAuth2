const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
require('dotenv').config();
const morgan = require('morgan');
const MongoStore = require('connect-mongo')(session);
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const connectDB = require('./src/config/db');

require('./src/config/passport')(passport);

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
app.use('/', require('./src/routes/index.route'));
app.use('/auth', require('./src/routes/auth.route'));
app.use('/student', require('./src/routes/student.route'));
app.use('/lecturer', require('./src/routes/lecturer.route'));
app.use('/personnel', require('./src/routes/personnel.route'));
app.use('/course', require('./src/routes/course.route'));
app.use('/department', require('./src/routes/department.route'));
app.use('/post', require('./src/routes/post.route'));
app.use('/comment', require('./src/routes/comment.route'));
app.use('/assignment', require('./src/routes/assignment.route'));
app.use('/appointment', require('./src/routes/appointment.route'));

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  () => {
    console.log(`listening on: ${process.env.NODE_ENV} mode on port: ${process.env.PORT}`);
  },
);
