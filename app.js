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
    user = require('./models/user'),
    cors = require('cors'),
    validator = require('express-validator'),
    MongoStore = require('connect-mongo')(session),
    moment = require('moment'),
    indexRoutes = require("./routes/routes"),
    poliklinikRoutes = require("./routes/routes_poliklinik"),
    spesialisRoutes = require("./routes/routes_spesialis"),
    jpdRoutes = require("./routes/routes_jpd"),
    agamaRoutes = require("./routes/routes_agama"),
    statusmenikahRoutes = require("./routes/routes_status_menikah"),
    barang_masukRoutes = require("./routes/routes_barang_masuk"),
    barang_keluarRoutes = require("./routes/routes_barang_keluar"),
    dokterRoutes = require("./routes/routes_dokter"),
    jabatanRoutes = require("./routes/routes_jabatan"),
    pegawaiRoutes = require("./routes/routes_pegawai"),
    gedungRoutes = require("./routes/routes_gedung"),
    barangRoutes = require("./routes/routes_barang"),
    ruanganRoutes = require("./routes/routes_ruangan"),
    tempattidurRoutes = require("./routes/routes_tempat_tidur"),
    pasienRoutes = require("./routes/routes_pasien"),
    pendaftaranRoutes = require("./routes/routes_pendaftaran"),
    kategoribarangRoutes = require("./routes/routes_kategori_barang"),
    satuanbarangRoutes = require("./routes/routes_satuan_barang"),
    dataobatRoutes = require("./routes/routes_obat_alkes_bhp"),
    golonganobatRoutes = require("./routes/routes_golongan_obat"),
    supplierRoutes = require("./routes/routes_supplier"),
    pengadaanobatRoutes = require("./routes/routes_pengadaanobat"),
    penjualanobatRoutes = require("./routes/routes_penjualanobat"),
    diagnosapenyakitRoutes = require("./routes/routes_diagnosa_penyakit"),
    diagnosapakarRoutes = require("./routes/routes_diagnosa_pakar"),
    gejalapakarRoutes = require("./routes/routes_gejala_pakar"),
    relasipakarRoutes = require("./routes/routes_relasi_pakar"),
    kategoritindakanRoutes = require("./routes/routes_kategori_tindakan"),
    tindakanRoutes = require("./routes/routes_tindakan"),
    pemeriksaanlaboratoriumRoutes = require("./routes/routes_pemeriksaanlaboratorium"),
    subpemeriksaanlaboratoriumRoutes = require("./routes/routes_sub_pemeriksaanlaboratorium"),
    app = express();
mongoose.connect(configDB.url, {
    useNewUrlParser: true
}); // connect to our database
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

app.use(function (req, res, next) { //buat melihat siapa yang login, ada di header welcome back!! semacam session bisa mengeluarkan email 
    res.locals.currentUser = req.user;
    res.locals.session = req.session;
    res.locals.error = req.flash("error"); //utk mengirim pesan ke semua router
    res.locals.success = req.flash("success");
    res.locals.pesan_cari = req.flash("pesan_cari");
    // res.setHeader("Content-Type", "application/json");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use("/", indexRoutes);
app.use("/poliklinik", poliklinikRoutes);
app.use("/barang", barangRoutes);
app.use("/agama", agamaRoutes);
app.use("/statusmenikah", statusmenikahRoutes);
app.use("/spesialis", spesialisRoutes);
app.use("/jadwalpraktek", jpdRoutes);
app.use("/dokter", dokterRoutes);
app.use("/jabatan", jabatanRoutes);
app.use("/pegawai", pegawaiRoutes);
app.use("/gedung", gedungRoutes);
app.use("/ruangan", ruanganRoutes);
app.use("/tempattidur", tempattidurRoutes);
app.use("/pasien", pasienRoutes);
app.use("/stokopname", barang_masukRoutes);
app.use("/penjualan", barang_keluarRoutes);
app.use("/pendaftaran", pendaftaranRoutes);
app.use("/kategoribarang", kategoribarangRoutes);
app.use("/satuanbarang", satuanbarangRoutes);
app.use("/dataobat", dataobatRoutes);
app.use("/supplier", supplierRoutes);
app.use("/pengadaanobat", pengadaanobatRoutes);
app.use("/golonganobat", golonganobatRoutes);
app.use("/penjualanobat", penjualanobatRoutes);
app.use("/diagnosapenyakit", diagnosapenyakitRoutes);
app.use("/diagnosapakar", diagnosapakarRoutes);
app.use("/gejalapakar", gejalapakarRoutes);
app.use("/relasipakar", relasipakarRoutes);
app.use("/kategoritindakan", kategoritindakanRoutes);
app.use("/tindakan", tindakanRoutes);
app.use("/pemeriksaanlaboratorium", pemeriksaanlaboratoriumRoutes);
app.use("/subpemeriksaanlaboratorium", subpemeriksaanlaboratoriumRoutes);

app.get("*", function (req, res) {
    res.send("404");
});


const host = '0.0.0.0';
const port = process.env.PORT || 4000;
app.listen(port, host, function (req, res) {
    console.log("Server SIMRS telah dimulai");
});