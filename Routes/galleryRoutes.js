const express = require('express');
const router = express.Router();
const { Insert, GetAll,GetByID,Delete } = require('../Controller/galleryController');
const uploadMiddleware = require('../config/multerUpload');
const passport = require('passport');

router.post('/', passport.authenticate('jwt', { session: false }), uploadMiddleware, Insert);
router.get('/', passport.authenticate('jwt', { session: false }), GetAll);
router.get('/:id',passport.authenticate('jwt',{session:false}),GetByID);
router.delete('/:id',passport.authenticate('jwt',{session:false}),Delete);

module.exports = router;