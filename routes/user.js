const express=require('express');
const router=express.Router({mergeParams:true});
const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
const Campground=require('../models/campground');
const User=require('../models/user');
const passport=require('passport');
const { storeReturnTo } = require('../middleware');
const Users=require('../controllers/users');

router.route('/register')
.get(Users.renderRegisterForm)
.post(catchAsync(Users.createNewUser));

router.route('/login')
.get(Users.renderLoginForm)
.post(storeReturnTo ,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),Users.login);

router.get('/logout',Users.logout);

module.exports=router;