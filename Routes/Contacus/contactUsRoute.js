const express = require('express');
const router =express.Router();

const {Insert ,GetAll} = require('../../Controller/ContactUS/contactUsController');

router.post('/post',Insert);
router.post('/',GetAll);

module.exports= router;
