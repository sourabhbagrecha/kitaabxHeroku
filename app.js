const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const MongoDBStore = require('connect-mongodb-session')(session);

const User = require('./models/user');
const Subject = require('./models/subject');

const PORT = process.env.PORT || 3001;
// const MONGODB_URI = 'mongodb://localhost/kitaabx-main';
const MONGODB_URI = process.env.DB_URI;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const routes = require('./routes');

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(
    session({
        secret: "My little Secret",
        resave: false,
        saveUninitialized: false,
        store: store
    })
);
app.use(flash());
app.use((req, res, next) => {
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
    })
});
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use(routes);

mongoose
  .connect(MONGODB_URI,{ useNewUrlParser: true })
  .then((result) => {
    app.listen(PORT, () => console.log('Listening on', PORT));
  })
  .catch((err)=>{
    console.log(err);
  })
