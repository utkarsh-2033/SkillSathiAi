const express = require('express');
const { deleteusercontroller, logoutuserhandler, updateprofilecontroller,updateCareerDetails ,saveQuizResult, getProgress } = require('../controllers/user.controller.js');
const verifyUser  = require('../utils/verifyUser.js');

const router=express.Router();

router.post('/updateprofile/:id',verifyUser,updateprofilecontroller)

router.delete('/deleteuser/:id',verifyUser,deleteusercontroller);

router.post('/logout',logoutuserhandler);

router.put("/career/:id",verifyUser, updateCareerDetails);

router.post("/saveQuizResult/:id", saveQuizResult);

router.get("/api/progress/:userId", getProgress);

module.exports = router;
