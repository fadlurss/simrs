const Pasien = require('../models/Tbl_pasien');
Agama = require('../models/Tbl_agama');
Status_menikah = require('../models/Tbl_status_menikah');
middleware = require('../middleware');
Joi = require('joi');
// asyncMiddleware = require('../middleware');

exports.read_pasien = middleware.asyncMiddleware(async (req, res, next) => {
    const allpasien = await Pasien.find({})
        .populate('status_menikah')
        .populate('agama');
    const custom = await Pasien.find({
            'umur': {
                $gt: 21
            }
        })
        .populate('status_menikah')
        .populate('agama');
    console.log("custom " + custom);

    res.render('v_pasien/index', {
        data_pasien: allpasien,
    });
});

exports.create_pasien = middleware.asyncMiddleware(async (req, res, next) => {
    var counter = await Pasien.countDocuments();
    const data_agama = await Agama.find({});
    const data_status_menikah = await Status_menikah.find({});
    res.render('v_pasien/new', {
        data_agama: data_agama,
        data_status_menikah: data_status_menikah,
        counter: (counter + 1)
    });
});

exports.post_pasien = middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({
        ...req.body
    });
    const {
        value,
        error
    } = result;
    const valid = error == null;
    if (!valid) {
        // jika tidak valid, atau salah...
        res.status(422).json({
            message: 'Invalid request',
        });
        console.log(error);
    } else {
        const input_pasien_baru = await Pasien.create(result.value);
        res.redirect('/pasien');
    }
});

exports.edit_pasien = middleware.asyncMiddleware(async (req, res, next) => {
    const data_agama = await Agama.find({});
    const data_status_menikah = await Status_menikah.find({});
    const cari_pasien = await Pasien.findById(req.params.id)
        .populate('agama')
        .populate('status_menikah');
    res.render('v_pasien/edit', {
        data_pasien: cari_pasien,
        data_agama: data_agama,
        data_status_menikah: data_status_menikah,
    });
});

exports.update_pasien = middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({
        ...req.body
    });
    const hasilUpdate = await Pasien.findOneAndUpdate({
        _id: req.params.id,
    }, {
        $set: {
            ...req.body
        },
    });
    res.redirect('/pasien');
});

exports.delete_pasien = middleware.asyncMiddleware(async (req, res, next) => {
    const delete_pasien = await Pasien.findByIdAndRemove(req.params.id);
    res.redirect('/pasien');
});