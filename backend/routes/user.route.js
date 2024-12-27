const express = require('express');
const { deleteusercontroller, logoutuserhandler, updateprofilecontroller } = require('../controllers/user.controller.js');
const { verifyUser } = require('../utils/verifyUser.js');

const router=express.Router();

router.post('/updateprofile/:id',updateprofilecontroller)

router.delete('/deleteuser/:id',deleteusercontroller);

router.post('/logout',logoutuserhandler);

module.exports = router;