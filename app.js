const express = require('express');
const session = require('express-session');
const db = require('./config/mongoose');
const app = express();
const port = 5100;

// setup session middleware
app.use(session({
    name: 'ECell',
    secret: 'work',
    cookie: {
        maxAge: (1000 * 60 * 60)
    },
    saveUninitialized: false, 
    resave: false
}));

// passport setup
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// setup the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// middleware for static files
app.use(express.static('./assets'));

// setup layouts uses
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);

// setup body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setup cookie parser middleware
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// extract style nd script from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// flash messages
const flash = require('connect-flash');
const flashMiddleware = require('./config/flash_middleware');
app.use(flash());
app.use(flashMiddleware.setFlash);

// make upload path availabe for the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

// setup routes
app.use('/', require('./routes/index'));

app.listen(port, function(err){

    if(err){
        console.log(`Error on running server at port:  ${port}`);
    }
    console.log("Server is up at port: ", `${port}`);
})