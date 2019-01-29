require('dotenv').config();
const express = require('express'),
    helmet = require('helmet'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    flash = require('connect-flash'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    configDB = require('./config/database.js'),
    session = require('express-session'),
    methodOverride = require('method-override'),
    cors = require('cors'),
    validator = require('express-validator'),
    MongoStore = require('connect-mongo')(session),
    moment = require('moment'),
    poliklinikRoutes = require("./routes/routes_poliklinik"),
    spesialisRoutes = require("./routes/routes_spesialis"),
    jpdRoutes = require("./routes/routes_jpd"),
    dokterRoutes = require("./routes/routes_dokter"),
    app = express();
mongoose.connect(configDB.url, {
    useNewUrlParser: true
}); // connect to our database
app.set('view engine', 'ejs');
app.use(helmet());
app.use(validator());
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({
    extended: true
})); // ini harus true, nanti tidak bisa diedit
app.use(methodOverride("_method"));
(moment.locale('id')); //mengganti bahasa moment.js ke bahasa indonesia
app.locals.moment = require('moment');
app.use(flash());
app.use(cors());
app.use(require('express-session')({
    secret: '#%^bnBHEGVB454Nfc2@', // session secret
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    }),
    cookie: {
        maxAge: 180 * 60 * 1000
    }
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(express.static(__dirname + "/public")); // jangan pakai koma seperti config
app.use(express.static(__dirname, +"/config"));

app.use("/poliklinik", poliklinikRoutes);
app.use("/spesialis", spesialisRoutes);
app.use("/jadwalpraktek", jpdRoutes);
app.use("/dokter", dokterRoutes);

app.get("*", function (req, res) {
    res.send("404");
});


const host = '0.0.0.0';
const port = process.env.PORT || 4000;
app.listen(port, host, function (req, res) {
    console.log("Server SIMRS telah dimulai");
});