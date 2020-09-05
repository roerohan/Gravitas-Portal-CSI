require('dotenv').config()
require('./models/db');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');
const path = require('path');
const session = require('express-session');

const admin = require('./routes/admin');
const authenticate = require('./routes/authenticate');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyparser.urlencoded({
    extended: false,
}));

app.use(session({
    secret: 'session secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 12 * 60 * 60 * 100
    }
}));

app.set('views', path.join(__dirname, '/views/'));

app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'mainLayout',
    layoutsDir: __dirname + '/views/layouts/'
}));

app.set('view engine', 'hbs');

app.use('/static', express.static(path.join(__dirname, 'static')));

app.listen(port, () => {
    console.log(`[INFO] Express server started. PORT: ${port}`);
});

app.use('/auth', authenticate);
app.use('/', admin);
