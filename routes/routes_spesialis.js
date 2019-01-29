var express = require('express')
router = express.Router()
Spesialis = require("../models/Tbl_spesialis")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    nama_spesialis: Joi.string().regex(/^[a-zA-Z]/).trim().required(),
    submit: Joi.any()
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const allSpesialis = await Spesialis.find({});
    res.render('v_spesialis/index', {
        data_spesialis: allSpesialis
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    res.render('v_spesialis/new');
}))

router.post('/new', middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    console.log(result.error);
    const {
        value,
        error
    } = result;
    const valid = error == null;
    if (!valid) {
        res.status(422).json({
            message: 'Invalid request',
            data: result
        })
    } else {
        const input_spesialis_baru = await Spesialis.create(result.value);
        res.redirect("/spesialis");
    }
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const data_spesialis = await Spesialis.findById(req.params.id);
    res.render("v_spesialis/edit", {
        spesialis: data_spesialis
    });
}))



router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    const hasilUpdate = await Spesialis.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: { ...req.body
        }
    });
    res.redirect("/spesialis");
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_spesialis = await Spesialis.findByIdAndRemove(req.params.id);
    res.redirect("/spesialis");
}))

module.exports = router;