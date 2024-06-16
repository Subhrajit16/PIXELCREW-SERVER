const express = require("express");
const router = express.Router();
const passport = require('passport');
const {Insert,GetAll,GetByID,Update,Delete} = require ('../Controller/ProductController');


router.post('/post', passport.authenticate('jwt', { session: false }), Insert);
router.get('/', passport.authenticate('jwt', { session: false }), GetAll);
router.put('/:id' , passport.authenticate('jwt', { session: false }), Update);
router.delete('/:id' , passport.authenticate('jwt', { session: false }), Delete);
router.get('/:id',passport.authenticate('jwt', { session: false }), GetByID);


module.exports = router;