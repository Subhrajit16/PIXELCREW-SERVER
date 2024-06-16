const express = require("express");
const router = express.Router();
const passport = require('passport');
const {Insert,GetAll,GetByID,Update,Delete,UpdateStatus,GetBookingCounts,GetByUserID,createOrder,verifyPayment} = require ('../Controller/BookingController');

router.get('/counts', passport.authenticate('jwt', { session: false }), GetBookingCounts);
router.get('/user',passport.authenticate('jwt', { session: false }), GetByUserID);
router.post('/post', passport.authenticate('jwt', { session: false }), Insert);
router.post('/create-order', passport.authenticate('jwt', { session: false }), createOrder);
router.post('/verify', passport.authenticate('jwt', { session: false }), verifyPayment);
router.get('/', passport.authenticate('jwt', { session: false }), GetAll);
router.put('/:id' , passport.authenticate('jwt', { session: false }), Update);
router.delete('/:id' , passport.authenticate('jwt', { session: false }), Delete);
router.get('/:id',passport.authenticate('jwt', { session: false }), GetByID);
router.put('/:id/status' , passport.authenticate('jwt', { session: false }), UpdateStatus);

module.exports = router;