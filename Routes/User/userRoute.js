const express = require("express");
const router = express.Router();

const {CreateUser,GetAll,Login} = require ('../../Controller/User/userController');

router.post("/post",CreateUser);
router.post("/login",Login);
router.get("/",GetAll);

module.exports = router;