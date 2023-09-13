const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync');
const {isLoggedIn,validateCampground,isAuthor}=require('../middleware.js');
const Campgrounds= require('../controllers/campground');
const multer  = require('multer')
const{storage}=require('../cloudinary')//node automatically looks for index.js file in a folder
const upload = multer({ storage })


router.route('/')
.get(catchAsync(Campgrounds.index))
 .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(Campgrounds.createCampground));
// .post(upload.array('image'),(req,res)=>{
//   console.log(req.boody,req.files);
//   res.send("it worked");
// })
 router.get('/new',isLoggedIn,Campgrounds.renderNewForm);
 router.get('/search',Campgrounds.searchCampground)
 
router.route('/:id')
.get(catchAsync(Campgrounds.showCampground))
.put(isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync(Campgrounds.editCampground))
.delete(isLoggedIn,isAuthor,catchAsync(Campgrounds.deleteCampground));

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(Campgrounds.renderEditForm));

  module.exports=router;