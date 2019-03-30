var express = require('express');
router = express.Router();
Pasien = require('../models/Tbl_pasien');
Agama = require('../models/Tbl_agama');
Status_menikah = require('../models/Tbl_status_menikah');
middleware = require('../middleware');
Joi = require('joi');
asyncMiddleware = require('../middleware');

const schema = Joi.object().keys({
	no_rm: Joi.number().required(),
	no_rm_lama: Joi.any(),
	nama_pasien: Joi.string().required(),
	tanggal_lahir: Joi.date().required(),
	umur: Joi.number().required(),
	alamat: Joi.string().required(),
	pekerjaan: Joi.string().required(),
	no_hp: Joi.any(),
	agama: Joi.string().required(),
	status_menikah: Joi.string().required(),
	jenis_kelamin: Joi.any().valid('Laki-laki', 'Perempuan'),
	no_bpjs: Joi.any(),
	submit: Joi.any(),
});

router.get(
	'/',
	middleware.asyncMiddleware(async (req, res, next) => {
		const allpasien = await Pasien.find({})
			.populate('status_menikah')
			.populate('agama');
		res.render('v_pasien/index', {
			data_pasien: allpasien,
		});
	})
);

router.get(
	'/new',
	middleware.asyncMiddleware(async (req, res, next) => {
		const data_agama = await Agama.find({});
		const data_status_menikah = await Status_menikah.find({});
		res.render('v_pasien/new', {
			data_agama: data_agama,
			data_status_menikah: data_status_menikah,
		});
	})
);

router.post(
	'/new',
	middleware.asyncMiddleware(async (req, res, next) => {
		const result = Joi.validate({ ...req.body }, schema);
		const { value, error } = result;
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
	})
);

router.get(
	'/:id/edit',
	middleware.asyncMiddleware(async (req, res, next) => {
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
	})
);

router.put(
	'/:id',
	middleware.asyncMiddleware(async (req, res, next) => {
		const result = Joi.validate({ ...req.body }, schema);
		const hasilUpdate = await Pasien.findOneAndUpdate(
			{
				_id: req.params.id,
			},
			{
				$set: { ...req.body },
			}
		);
		res.redirect('/pasien');
	})
);

router.delete(
	'/:id',
	middleware.asyncMiddleware(async (req, res, next) => {
		const delete_pasien = await Pasien.findByIdAndRemove(req.params.id);
		res.redirect('/pasien');
	})
);

module.exports = router;
