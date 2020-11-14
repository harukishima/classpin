require('dotenv').config();
const express = require('express');
const app = express();
const key = require('./config/main');
const {port, mongo_URL, SECRET_SESSION} = key;
const ConnectMongoDB = require('./connect');
var cookieParser = require('cookie-parser');
const userRoutes = require('./routes/users.routes');
const authRoutes = require('./routes/auth.routes');
const logoutRoutes = require('./routes/logout.routes');
const signupRoutes = require('./routes/signup.routes');
const classRoutes = require('./routes/class.routes');
const guideRoutes = require('./routes/guide.routes');
const authMiddleware = require('./middleware/login.middleware');

app.use(express.static('public'));

var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

app.set('view engine', 'pug');
app.set('views', './views');


const mongoose = require('mongoose');   
// mongoose.connect('mongodb://localhost/ClassPin' ,{ useNewUrlParser: true }, { useUnifiedTopology: true });
ConnectMongoDB(mongo_URL);

const bodyParser = require('body-parser');
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser(SECRET_SESSION));

app.listen(port, function() {
    console.log("Listening on port " + port);
});

app.get('/', authMiddleware.authRequire, (req, res) => {
    res.render('index');
});

app.use('/users', authMiddleware.authRequire, userRoutes);

app.use('/login', authRoutes);

app.use('/signup', signupRoutes);

app.use('/logout', authMiddleware.authRequire, logoutRoutes);

app.use('/class', authMiddleware.authRequire, classRoutes);

app.use('/guide', authMiddleware.authRequire, guideRoutes);
