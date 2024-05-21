const express = require("express");
const router = express.Router();
const passport = require('passport');
const { ValidationRules } = require('../../config/validation');
const validateRequest = require('../../config/validationRequest');

const {CreatePost,GetByID,Update,Delete ,FilterByLocation,GetPostCounts} = require ('../../Controller/Post/PostController');


router.post('/insert',passport.authenticate('jwt', { session: false }),ValidationRules(),validateRequest, CreatePost);
router.get('/byuserid', passport.authenticate('jwt', { session: false }), GetByID);
router.put('/:postId' , passport.authenticate('jwt', { session: false }), Update);
router.delete('/:postId' , passport.authenticate('jwt', { session: false }), Delete);
router.post('/filter',passport.authenticate('jwt', { session: false }), FilterByLocation);
router.get('/counts',passport.authenticate('jwt', { session: false }), GetPostCounts);
module.exports = router;