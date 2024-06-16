const express = require("express");
const router = express.Router();
const passport = require('passport');
const { ValidationRules } = require('../../config/validation');
const validateRequest = require('../../config/validationRequest');
const uploadMiddleware = require('../../config/multerUpload');
const {CreatePost,GetAll,GetByID,Update,Delete ,FilterByLocation,GetPostCounts,likePost,commentPost,GetPostCountsPerDate,GetLikesAndCommentsCount} = require ('../../Controller/Post/PostController');

// Specific routes first
router.get('/date', passport.authenticate('jwt', { session: false }), GetPostCountsPerDate);
router.get('/counts', passport.authenticate('jwt', { session: false }), GetPostCounts);
router.get('/likes', passport.authenticate('jwt', { session: false }), GetLikesAndCommentsCount);
// Generic routes later
// router.post('/insert',passport.authenticate('jwt', { session: false }),ValidationRules(),validateRequest,UploadFile, CreatePost);
router.post('/insert', passport.authenticate('jwt', { session: false }), uploadMiddleware, CreatePost);
router.get('/', passport.authenticate('jwt', { session: false }), GetAll);
router.get('/:id', passport.authenticate('jwt', { session: false }), GetByID);
router.put('/:postId', passport.authenticate('jwt', { session: false }), Update);
router.delete('/:postId', passport.authenticate('jwt', { session: false }), Delete);
router.post('/filter', passport.authenticate('jwt', { session: false }), FilterByLocation);
router.post('/:id/like', passport.authenticate('jwt', { session: false }), likePost);
router.post('/:id/comment', passport.authenticate('jwt', { session: false }), commentPost);

module.exports = router;

module.exports = router;