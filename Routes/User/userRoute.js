const express = require("express");
const router = express.Router();
const UploadFile = require('../../config/multerUpload');
const {CreateUser,GetAll,Login,GetbyId,UpdateAvatar,Update,GetuserCounts} = require ('../../Controller/User/userController');

router.get("/counts",GetuserCounts);
router.post("/post",CreateUser);
router.post("/login",Login);
router.get("/",GetAll);
router.get("/:id",GetbyId);
router.patch("/avatar/:id",UploadFile,UpdateAvatar)
router.patch("/:id",Update)
module.exports = router;