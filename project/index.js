require('dotenv').config();
require('express-async-errors');
var session = require('express-session');
const express = require('express');
const roles = require('./roles');
var app = express();
const key = require('./config/main');
const {port, mongo_URL, SECRET_SESSION} = key;
var cookieParser = require('cookie-parser');
const userRoutes = require('./routes/users.routes');
const authRoutes = require('./routes/auth.routes');
const logoutRoutes = require('./routes/logout.routes');
const signupRoutes = require('./routes/signup.routes');
const classRoutes = require('./routes/class.routes');
const guideRoutes = require('./routes/guide.routes');
const authMiddleware = require('./middleware/login.middleware');
const localsUserMiddleware = require('./middleware/localsUser.middleware');
const adminRoutes = require('./routes/admin.routes.js');

app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', './views');
const bodyParser = require('body-parser');
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser(SECRET_SESSION));

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
}));



// Connect to mongodb use callback function
roles.connectMongodb(mongo_URL, initRoutes);

function initRoutes(acl) {

  app.get('/info', authMiddleware.authRequire, (req, res) => {
    acl.allowedPermissions(req.session.userId, ['/class', '/guide', '/users'], (err, permission) => {
        res.json(permission);
    });
  });
  
  app.get('/role', authMiddleware.authRequire, (req, res) => {
    acl.userRoles(req.session.userId, (err, roles) => {
        res.json(roles);
    })
  });
  
  
  app.get('/about', (req, res) => {
    throw new Error('ABOUT BROKEN');
  })

  app.use('/admin', authMiddleware.authRequire, acl.middleware(1),  adminRoutes);
  
  app.use('/users', authMiddleware.authRequire, acl.middleware(1), userRoutes);
  
  app.use('/login', authRoutes);
  
  app.use('/signup', signupRoutes);
  
  app.use('/logout', authMiddleware.authRequire, logoutRoutes);
  
  app.use('/class', authMiddleware.authRequire, acl.middleware(1), classRoutes);
  
  app.use('/guide', authMiddleware.authRequire, guideRoutes);

  app.get('/', localsUserMiddleware.localsUser, (req, res) => {
    res.render('index');
  });

  app.use(function(req, res) {
    res.render('404');
  });

    // default error handler
  app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.render('500');
  });

}

// connect to mongodb and then listening 
app.listen(port, function() {
  console.log("Listening on port " + port);
});


module.exports = {
  initRoutes,
  app,
}
