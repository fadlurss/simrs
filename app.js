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
    User = require('./models/user'),
    cors = require('cors'),
    validator = require('express-validator'),
    MongoStore = require('connect-mongo')(session),
    moment = require('moment'),
    indexRoutes = require("./routes/routes_users"),
    poliklinikRoutes = require("./routes/routes_poliklinik"),
    spesialisRoutes = require("./routes/routes_spesialis"),
    jpdRoutes = require("./routes/routes_jpd"),
    agamaRoutes = require("./routes/routes_agama"),
    statusmenikahRoutes = require("./routes/routes_status_menikah"),
    dokterRoutes = require("./routes/routes_dokter"),
    pegawaiRoutes = require("./routes/routes_pegawai"),
    pasienRoutes = require("./routes/routes_pasien"),
    pendaftaranRoutes = require("./routes/routes_pendaftaran"),
    diagnosapenyakitRoutes = require("./routes/routes_diagnosa_penyakit"),
    diagnosapakarRoutes = require("./routes/routes_diagnosa_pakar"),
    diagnosaRoutes = require("./routes/routes_diagnosa"),
    gejalapakarRoutes = require("./routes/routes_gejala_pakar"),
    relasipakarRoutes = require("./routes/routes_relasi_pakar"),
    kategoritindakanRoutes = require("./routes/routes_kategori_tindakan"),
    tindakanRoutes = require("./routes/routes_tindakan"),
    notifikasiRoutes = require("./routes/routes_notifikasi"),
    pemeriksaanlabRoutes = require("./routes/routes_pemeriksaanlaboratorium")
subpemeriksaanlabRoutes = require("./routes/routes_sub_pemeriksaanlaboratorium")
app = express();

mongoose
    .connect(configDB.url, {
        useNewUrlParser: true
    }) // Let us remove that nasty deprecation warrning :)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));
require('./config/passport')(passport);
app.set('view engine', 'ejs');
app.enable("trust proxy");
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

app.use(async function (req, res, next) { //buat melihat siapa yang login, ada di header welcome back!! semacam session bisa mengeluarkan email
    res.locals.currentUser = req.user;
    if (req.user) {
        try {
            let dada = await User.findById(req.user._id).populate('notifications', null, {
                isRead: false
            });
            dadabaru = [];
            for (var i = 0; i < dada.length; i++) {

                if (dada[i].local.notifications != null) {
                    // console.log(dada[i]);
                    res.locals.dadabaru[i] = dada[i];
                }
            }
            // res.locals.dadabaru[0] = dada[0];

        } catch (err) {
            console.log(err.message);
        }
    }
    res.locals.session = req.session;
    res.locals.error = req.flash("error"); //utk mengirim pesan ke semua router
    res.locals.success = req.flash("success");
    res.locals.pesan_cari = req.flash("pesan_cari");
    res.locals.berhasil = req.flash("berhasil");
    // res.setHeader("Content-Type", "application/json");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use("/", indexRoutes);
app.use("/poliklinik", poliklinikRoutes);
app.use("/agama", agamaRoutes);
app.use("/statusmenikah", statusmenikahRoutes);
app.use("/spesialis", spesialisRoutes);
app.use("/jadwalpraktek", jpdRoutes);
app.use("/dokter", dokterRoutes);
app.use("/pegawai", pegawaiRoutes);
app.use("/pasien", pasienRoutes);
app.use("/pendaftaran", pendaftaranRoutes);
app.use("/diagnosapenyakit", diagnosapenyakitRoutes);
app.use("/diagnosapakar", diagnosapakarRoutes);
app.use("/gejalapakar", gejalapakarRoutes);
app.use("/relasipakar", relasipakarRoutes);
app.use("/kategoritindakan", kategoritindakanRoutes);
app.use("/tindakan", tindakanRoutes);
app.use("/diagnosa", diagnosaRoutes);
app.use("/notifikasi", notifikasiRoutes);
app.use("/pemeriksaanlaboratorium", pemeriksaanlabRoutes);
app.use("/subpemeriksaanlaboratorium", subpemeriksaanlabRoutes);

app.get("*", function (req, res) {
    res.send("404");
});


const host = '0.0.0.0';
const port = process.env.PORT || 4000;
app.listen(port, host, function (req, res) {
    console.log("Server SIMRS telah dimulai");
});