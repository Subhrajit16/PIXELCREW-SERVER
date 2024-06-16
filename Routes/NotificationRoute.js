const express = require("express");
const router = express.Router();
const passport = require('passport');
const {Insert,GetAll,GetByID,Update,Delete,GetCount} = require ('../Controller/NotificationController');


router.post('/post', passport.authenticate('jwt', { session: false }), Insert);
router.get('/', passport.authenticate('jwt', { session: false }), GetAll);
router.get('/count', passport.authenticate('jwt', { session: false }), GetCount);
router.put('/:id' , passport.authenticate('jwt', { session: false }), Update);
router.delete('/:id' , passport.authenticate('jwt', { session: false }), Delete);
router.get('/user',passport.authenticate('jwt', { session: false }), GetByID);

module.exports = router;