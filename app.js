const express = require('express');
const session = require('express-session');
const db = require('./config/mongoose');
const app = express();
const port = 5100;

app.use(express.static('./assets'));

// setup the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// setup layouts uses
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);

// setup body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setup cookie parser middleware
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// setup session middleware
app.use(session({
    name: 'ECell',
    secret: 'work',
    cookie: {
        maxAge: 60000
    },
    saveUninitialized: true, 
    resave: true
}));

// extract style nd script from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// flash messages
const flash = require('connect-flash');
const flashMiddleware = require('./config/flash_middleware');
app.use(flash());
app.use(flashMiddleware.setFlash);

// setup routes
app.use('/', require('./routes/index'));

app.listen(port, function(err){

    if(err){
        console.log(`Error on running server at port:  ${port}`);
    }
    console.log("Server is up at port: ", `${port}`);
})