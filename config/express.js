/**
 * Module dependencies.
 */
var path = require('path'),
  express = require('express'),
  bodyParser = require('body-parser'),
  multer = require('multer'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  compress = require('compression'),
  morgan = require('morgan'),
  rollbar = require('rollbar'),
  helmet = require('helmet'),
  MongoStore = require('connect-mongo')(session),
  passport = require('passport'),
  config = require('./config');

module.exports = function(db, options) {
  // Initialize express app
  var app = express();

  // Setting application local variables
  app.locals.env = process.env.NODE_ENV;
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  app.locals.keywords = config.app.keywords;

  // Showing stack errors
  app.set('showStackError', true);

  // Set views path and view engine
  app.set('views', './app/views');
  app.set('view engine', 'jade');

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    // Enable logger (morgan)
    app.use(morgan('dev'));

    // Disable views cache
    app.set('view cache', false);
  } else if (process.env.NODE_ENV === 'production') {
    app.locals.cache = 'memory';
  }

  // Passing the request url to environment locals
  app.use(function(req, res, next) {
    res.locals.url = req.protocol + '://' + req.headers.host + req.url;
    next();
  });

  // Should be placed before express.static
  app.use(compress({
    filter: function(req, res) {
      return (/json|text|javascript|css/).test(res.getHeader(
        'Content-Type'));
    },
    threshold: '5kb',
    level: 8
  }));

  // Use helmet to secure Express headers
  app.use(helmet.frameguard())
    .use(helmet.xssFilter())
    .use(helmet.nosniff())
    .use(helmet.ienoopen())
    .disable('x-powered-by');

  // Setting the app router and static folder
  app.use(express.static(path.resolve('./public')));

  app.use(bodyParser.urlencoded({
      extended: true
    }))
    .use(bodyParser.json())
    .use(multer({
      inMemory: true
    }))
    .use(cookieParser()); // CookieParser should be above session

  // Express MongoDB session storage
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret,
    store: new MongoStore({
      mongooseConnection: db.connection,
      collection: config.sessionCollection
    })
  }));

  // use passport session
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(rollbar.errorHandler('c3352d3a8f1e4526aac01b3913bad18f'));

  var waitingForSignup = options.userCount === 0 ? false : true;
  app.use(function(req, res, next) {
    if (waitingForSignup) {
      if (options.userCount === 0 && req.url.indexOf('/auth/callback') !== -1) {
        options.userCount = true;
      }

      next();
    } else {
      waitingForSignup = true;

      var state = encodeURIComponent(JSON.stringify({
        isAdmin: true
      }));

      return res.redirect('/auth/google?state=' + state);
    }
  });

  // Globbing routing files
  config
    .getGlobbedPaths('./app/routes/**/*.js')
    .forEach(function(routePath) {
      var routes = require(path.resolve(routePath));

      app.use(routes.basePath, routes.router);
    });

  // Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
  app.use(function(err, req, res, next) {
    // If the error object doesn't exists
    if (!err) {
      return next();
    }

    // Log it
    console.error(err.stack);

    // Error page
    res.status(500).render('500', {
      error: err.stack
    });
  });

  /**
   * Instead of a 404, we'll respond with index.html
   */
  app.use(function(req, res) {
    res.render('index', {
      url: req.originalUrl,
      user: req.user || null
    });
  });

  return app;
};
