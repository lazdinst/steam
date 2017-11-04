const express = require('express');
const path = require('path');
const axios = require('axios');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const SteamStrategy = require('../lib/passport-steam').Strategy;
const app = express();

const authRoutes = require('./routes/auth');

/** ============================================================
 * Define Database Connections
 * ========================================================== */
// var items = require('../database-mysql');
// var items = require('../database-mongo');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/** ============================================================
 * Session Generation
 * ========================================================== */
// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Steam profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the SteamStrategy within Passport.
//   Strategies in passport require a `validate` function, which accept
//   credentials (in this case, an OpenID identifier and profile), and invoke a
//   callback with a user object.
passport.use(new SteamStrategy({
    returnURL: 'http://localhost:8080/auth/steam/return',
    realm: 'http://localhost:8080/',
    apiKey: '55DA5B587373A31116CAD4B8B4BE3F05'
  },
  function(identifier, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Steam profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Steam account with a user record in your database,
      // and return that user instead.
      profile.identifier = identifier;
      return done(null, profile);
    });
  }
));

app.use(session({
  name: 'PassportSession',
  secret: 'lacplesis',
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

/** ============================================================
 * Define Static Assests
 * ========================================================== */
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));
app.use(express.static(__dirname + '/../react-client/dist'));

/** ============================================================
 * Express Routes
 * ========================================================== */
// See views/auth.js for authentication routes
// app.use('/auth', authRoutes);

/** ============================================================
 * Routes
 * ========================================================== */

app.get('/', function(req, res){
  const preloadedState = {};
  preloadedState.user = req.user;
  res.render('index', {preloadedState});
});

// GET /auth/steam
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Steam authentication will involve redirecting
//   the user to steamcommunity.com.  After authenticating, Steam will redirect the
//   user back to this application at /auth/steam/return
app.get('/auth/steam', passport.authenticate('steam', { failureRedirect: '/' }), function(req, res) {
  console.log('I think i get here')
  res.render('index', { user: req.user });
});

// GET /auth/steam/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/steam/return',
passport.authenticate('steam', { failureRedirect: '/' }),
function(req, res) {
  console.log(req.user);
  res.redirect('/');
});

app.get('/achievements', function (req, res) {
  var url = 'http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=55DA5B587373A31116CAD4B8B4BE3F05&appid=8930';

  axios.get(url)
    .then(response => {
      console.log(response.data);
      res.send()
    })
    .catch((err) => {
      console.log('FAILED TO INJECT PRELOADED STATE');
    });
});


/** ============================================================
 * Middleware
 * ========================================================== */

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

module.exports = app;